/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import {
  Layout, Form, Input, Button, notification, Upload, message,
} from 'antd';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { MentionsInput, Mention } from 'react-mentions'; // for mentions
import postLib from './postAPI';
import groupLib from '../group/groupAPI';
import userLib from '../user/userAPI';
import './MakePost.css';
import 'antd/dist/antd.css';

const axios = require('axios');
// TODO, get all existing tags in db
const defaultTags = ['animal', 'happy', 'celeb', 'cat', 'dog', 'cs', 'tech', 'food'];

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function MakePost(props) {
  const {
    groupId, members, posts, activeUser,
  } = props;// should be passed by parent component, in GroupBoard
  // const [loading, setLoading] = useState(false);
  // const [ftype, setfType] = useState('');
  const [text, setText] = useState('');
  const [clickableMembers, setClickableMembers] = useState();
  const [clickableTags, setClickableTags] = useState();
  const [content, setContent] = useState('');
  const [notifiedMembers, setNotifiedMembers] = useState();
  const [currentGroupName, setCurrentGroupName] = useState('');
  const [tagNames, setTagNames] = useState([]);
  const [mentioned, setMentioned] = useState([]);

  // const activeUser = useSelector((state) => state.activeUser);
  const navigate = useNavigate();

  const [file, setFile] = useState();
  const tagMention = useRef();

  const socket = useSelector((state) => state.socket);

  // get the members who will be notified when there is a new post
  useEffect(async () => {
    if (members && activeUser) {
      const filteredMembers = members.filter((m) => m !== activeUser._id);
      setNotifiedMembers(filteredMembers);
    }
  }, []);

  useEffect(async () => {
    if (groupId) {
      await groupLib.getGroupById(groupId).then((currentGroup) => {
        setCurrentGroupName(currentGroup.name);
      });
    }
  });

  async function getClickableMembers() {
    // const res = await APIservice.get(`/users`);
    // Transform the users to what react-mentions expects
    if (members.length === 0) return; // error: cannot read properties of underfined

    if (members.length === 0) return;

    const memberArr = [];
    members.map(async (mid, idx) => {
      await userLib.getUserById(mid).then((user) => {
        memberArr.push({
          id: idx,
          display: user.username,
        });
      });
    });
    setClickableMembers(memberArr);
    console.log('memberArr is', memberArr);
  }

  function getClickableTags() {
    const tagArr = [];
    defaultTags.map((t, idx) => tagArr.push({
      id: idx,
      display: t,
    }));
    setClickableTags(tagArr);
  }

  useEffect(() => {
    getClickableMembers();
    getClickableTags();
  }, []);

  // event handler for file selection
  const updateFile = (e) => {
    console.log('in updateFile, e.target is ', e.target);
    setFile(e.target.files[0]);
  };

  function checkType() {
    console.log('file type is', file.type);
    const filetype = file.type.match('image.*') || file.type.match('audio.*') || file.type.match('video.*');
    if (!filetype) {
      message.error('File type not supported!');
    }
    const sizelimit = file.size / 1024 / 1024 < 20;
    if (!sizelimit) {
      message.error('Maximum size is 20MB!');
    }
    return filetype && sizelimit;
  }

  function clearTexts() {
    // clear input box
    const textBox = document.getElementById('posttext');
    textBox.value = '';
    setText('');
    // clear input file name
    const fileBox = document.getElementById('upld');
    fileBox.value = '';
    setFile();
    // clear hashtag or mentions input
    const tagmentionBox = document.getElementById('tagmention');
    tagmentionBox.value = '';
    setContent('');
  }

  // event handler for files upload
  const handleUpload = async () => {
    // e.preventDefault();

    // create new formdata object
    console.log('in handleUpload');
    console.log('file is', file);
    console.log('text is', text);

    // at least 1 of text and attachment file should be present
    if (text === '' && !file) {
      console.log('no text and no file!');
      notification.open({
        message: 'Must have some text contents or a file!',
        type: 'warning',
        duration: 3,
        closeIcon: (<div />), // hide the close btn
      });
      clearTexts();
      return;
    }
    const tags = [];
    const mentionedUsers = [];
    if (content) {
      // console.log('content is', content); // hashtag or handle
      let newContent = content;
      newContent = newContent.split(' ');
      // console.log('!!!!!!! newContents are', newContent);
      if (newContent.length !== 0) {
        // user starts with @@@____ and hashtag starts with $$$____
        newContent.map((c) => {
          if (c.startsWith('@@@')) {
            // username starts from idx 5
            const name = c.substring(5).toLowerCase();
            // remove dups
            if (!mentionedUsers.includes(name)) mentionedUsers.push(name);
          } else if (c.startsWith('$$$')) {
            const tag = c.substring(5).toLowerCase();
            if (!tags.includes(tag)) tags.push(tag);
          }
        });
        console.log('tags are', tags);
        console.log('mentioned users are', mentionedUsers);
        // get the ids of mentioned users
        mentionedUsers.forEach(async (user) => {
          const mentionedNotifiedUser = await userLib.getUserByName(user);
          socket?.emit('SendMentionUserNotification', {
            receiverId: mentionedNotifiedUser._id,
            group: currentGroupName,
          });
        });
      }
    }

    if (file) { // use formData
      console.log('file is ', file);

      // if there is an attachment, check type first
      if (!checkType()) {
        clearTexts();
        return;
      }

      const formData = new FormData();
      formData.append('userid', activeUser._id);
      formData.append('text', text);
      formData.append('file', file);// fieldname
      // won't work, will add as a string instead of an array
      // formData.append('hashtags', tags);
      // formData.append('mentioned', mentionedUsers);
      tags.forEach((item) => formData.append('hashtags[]', item));
      mentionedUsers.forEach((item) => formData.append('mentioned[]', item));

      console.log('formData is ');
      // Display the values
      // eslint-disable-next-line no-restricted-syntax
      for (const value of formData.values()) {
        console.log(value);
      }
      await postLib.makePostWithFile(groupId, formData).then((res) => {
        console.log('in component, res is', res);
        if (res) {
          console.log('Make post success');
          notification.open({
            message: 'Make Post Succeeded!',
            type: 'success',
            duration: 2,
            closeIcon: (<div />), // hide the close btn
          });
          props.addPost(res.data);// to lift state up
        }
      }).catch((err) => {
        console.log('error here in component, err is', err);
      });
      // send the notificatio to every member in the group
      if (notifiedMembers && currentGroupName) {
        notifiedMembers.forEach((memberId) => {
          socket?.emit('SendPostNotification', {
            senderName: activeUser.username,
            receiverId: memberId,
            group: currentGroupName,
          });
        });
      }
    } else {
      console.log('no file attachment ');
      const data = {
        userid: activeUser._id,
        text,
        hashtags: tags,
        mentioned: mentionedUsers,
      };
      await postLib.makePost(groupId, data).then((res) => {
        console.log('in component, res is', res);
        if (res) {
          notification.open({
            message: 'Make Post Succeeded!',
            type: 'success',
            duration: 2,
            closeIcon: (<div />), // hide the close btn
          });
          props.addPost(res.data);
        }
      }).catch((err) => {
        console.log('error here in component, err is', err);
      });
      // send the notificatio to every member in the group
      if (notifiedMembers && currentGroupName) {
        notifiedMembers.forEach((memberId) => {
          socket?.emit('SendPostNotification', {
            senderName: activeUser.username,
            receiverId: memberId,
            group: currentGroupName,
          });
        });
      }
    }
    // clear texts
    clearTexts();
  };

  const handleCancel = () => {
    // clear input box and input file name
    clearTexts();
  };

  const handleInputBoxChange = (e) => {
    setText(e.target.value);
  };

  function addContent(input) {
    if (input.length <= 2000) {
      setContent(input);
    }
  }

  return (
    <div>
      {activeUser ? (
        <div className="MainArea">
          {/* className="Post-Section"> */}
          <p className="Post">Post Whatever You Like</p>
          <div className="content">
            {/* should be directed from a group board, so will know the group name */}
            {/* <p>Group Name</p>
            <p>UserName Avatar</p> */}
            {/* <div className="PostContent">A Nice Day :)</div> */}
            <input className="PostContent" id="posttext" type="text" onChange={handleInputBoxChange} />
            <div className="description outline-none">
              <MentionsInput
                className="mentions"
                inputRef={tagMention}
                spellCheck="false"
                placeholder="@ someone in the group, or # a topic"
                id="tagmention"
                value={content}
                onChange={(event) => addContent(event.target.value)}
                style={{
                  backgroundColor: 'white',
                }}
              >
                <Mention
                  trigger="@"
                  data={clickableMembers}
                  markup="@@@____display__"
                  style={{
                    backgroundColor: '#daf4fa',
                  }}
                  // display is either 0 or 1
                  // onAdd={(id) => setMentioned((mentioned) => [...mentioned, id])}
                  appendSpaceOnAdd={true}
                />
                <Mention
                  trigger="#"
                  data={clickableTags}
                  markup="$$$____display__"
                  style={{
                    backgroundColor: '#daf4fa',
                  }}
                  // onAdd={(display) => setTagNames((tagNames) => [...tagNames, display])}
                  appendSpaceOnAdd={true}
                />
              </MentionsInput>
            </div>
            <div>
              <div
                onClick={() => {
                  tagMention.current.focus();
                  setContent((content) => `${content}@`);
                }}
                className="mentions_mention"
              >
                @
              </div>
              <div
                onClick={() => {
                  tagMention.current.focus();
                  setContent((content) => `${content}#`);
                }}
                className="mentions_mention"
              >
                #
              </div>
            </div>
          </div>
          <div className="media">
            <div>
              Upload Image/Audio/Video
              <input
                className="UploadAttachment"
                id="upld"
                type="file"
                name="file"
                onChange={(e) => updateFile(e)}
              />
            </div>
            {/* <button type="submit" onClick={() => handleUpload()}>
            </button> */}
          </div>
          <div className="ConfirmCancelPost">
            <button type="button" className="Confirm" onClick={() => handleUpload()}>Upload Post</button>
            <button type="button" className="Cancel" onClick={() => handleCancel()}>Cancel</button>
          </div>
        </div>
      ) : (
        <Link to="/login">Login to upload a post!</Link>
      )}
    </div>
  );
}

export default MakePost;
