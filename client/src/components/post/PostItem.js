/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint no-underscore-dangle: 0 */

import React, { useState, useEffect, useRef } from 'react';
import { ReactVideo } from 'reactjs-media';
import { Link } from 'react-router-dom';
import {
  Layout, Form, Input, Button, notification, Popover,
} from 'antd';
import { MentionsInput, Mention } from 'react-mentions'; // for mentions
import { Provider, useDispatch, useSelector } from 'react-redux';
import classes from './PostItem.module.css';
import userLib from '../user/userAPI';
import postLib from './postAPI';
import DefaultUserAvatar from '../defaultAvatar.jpeg';

const PostItem = (props) => {
  const {
    showButtons, activeUser, post, group, isAdmin,
  } = props;
  console.log('@@@@@@@@@@@@@@@@@@ post is', post);
  const defaultSrc = 'https://facepic.qidian.com/qd_face/349573/a430412837/0';
  // TODO could be replaced with UserNameAvatar component;
  // const activeUser = useSelector((state) => state.activeUser); // currently loggedin user
  const socket = useSelector((state) => state.socket);
  const dateFormatOptions = {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  };

  const [poster, setPoster] = useState(); // user who made this post
  const [showPost, setShowPost] = useState(true);// whether to show or hide this post
  const [attachment, setAttachment] = useState();
  const [attachmentType, setAttachmentType] = useState();
  // const [text, setText] = useState();
  const [editText, setEditText] = useState();
  const [comments, setComments] = useState();
  // for @ and # when create a comment
  const [clickableMembers, setClickableMembers] = useState();
  const [clickableTags, setClickableTags] = useState();
  const [commentContent, setCommentContent] = useState('');
  // const [tagNames, setTagNames] = useState([]);
  // const [mentioned, setMentioned] = useState([]);
  const tagMentionComment = useRef();

  const groupAvatar = group && group.profile_image ? group.profile_image : DefaultUserAvatar;
  const userAvatar = poster && poster.profile_image ? poster.profile_image : defaultSrc;

  // fetch user who posted this post
  useEffect(async () => {
    console.log('@@@@@@@@@', post);
    await userLib.getUserById(post.user_id).then((res) => {
      // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&poster is ', res);
      if (res !== '') {
        setPoster(res);
      }
    });
    // set comments
    // setComments(post.comments);
  }, []);

  useEffect(() => {
    // await userLib.getUserById(post.user_id).then((res) => {
    //   // console.log('poster is ', res);
    //   if (res !== '') {
    //     setPoster(res);
    //   }
    // });
    // set comments
    setComments(post.comments);
  }, [comments]);

  async function getClickableMembers() {
    const { members } = group;
    // Transform the users to what react-mentions expects
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
    // TODO, get all existing tags in db
    const defaultTags = ['happy', 'celeb', 'cat'];
    defaultTags.map((t, idx) => tagArr.push({
      id: idx,
      display: t,
    }));
    setClickableTags(tagArr);
  }

  function addCommentContent(input) {
    if (input.length <= 300) {
      setCommentContent(input);
    }
  }

  useEffect(() => {
    getClickableMembers();
    getClickableTags();
  }, []);

  // fetch attachment file for this post, if exist
  useEffect(async () => {
    console.log('post is ', post);
    if (post.attachment_name && post.attachment_type) {
      await postLib.getAttachmentByName(post.attachment_name).then((res) => {
        // attachment is not working, but after going to office hour, using url will just work
        // console.log('attachment url is ', res.url);
        setAttachment(res);
        setAttachmentType(post.attachment_type);
      }).catch((err) => {
        console.log('err is', err);
      });
    } else {
      console.log('this post has no attachment');
    }
  }, []);

  useEffect(() => {
    console.log('hide hide');
    if (activeUser) {
      if (post.hider.includes(activeUser._id)) {
        setShowPost(false);
      } else {
        setShowPost(true);
      }
    }
  }, []);

  // only admin can delete a post!
  async function DeleteHandler(event) {
    event.preventDefault();
    console.log(post._id);
    console.log('post need to be deleted : ', post);
    // back-end
    await postLib.deletePost(post._id).then((res) => {
      console.log(res);
    });
    // front-end
    setShowPost(false);
    // notification
    notification.open({
      message: 'Delete Succeeded!',
      // icon: <SmileTwoTone />,
      type: 'success',
      duration: 2,
      closeIcon: (<div />), // hide the close btn
    });
  }

  // const handleCommentInputChange = (e) => {
  //   setText(e.target.value);
  // };

  const handlePopoverChange = (e) => {
    setEditText(e.target.value);
  };

  async function editConfirmHandler(comment) {
    console.log('edit comment post is ', post._id);
    console.log('comment need to be edited is ', comment);
    console.log('comment user is ', activeUser);
    console.log('edited Comment is ', editText);
    await postLib.commentEdit(post._id, activeUser, comment, editText);
  }

  async function submitHandler(event) {
    console.log('here');
    event.preventDefault();
    // console.log('commented post is ', post._id);
    // console.log('commentContent is ', commentContent);
    const tags = [];
    const mentionedUsers = [];
    let rawComment = '';
    if (commentContent) {
      let newContent = commentContent;
      newContent = newContent.split(' ');
      // console.log('!!!!!!! newContents are', newContent);
      if (newContent.length !== 0) {
        // user starts with @@@____ and hashtag starts with $$$____
        newContent.map((c) => {
          if (c.startsWith('@@@')) {
            // username starts from idx 5
            const name = c.substring(5).toLowerCase();
            // remove dups
            if (!mentionedUsers.includes(name)) mentionedUsers.push(`@${name}`);
          } else if (c.startsWith('$$$')) {
            const tag = c.substring(5).toLowerCase();
            if (!tags.includes(tag)) tags.push(`#${tag}`);
          } else { // user input
            rawComment = rawComment.concat(' ', c);
          }
        });
        // console.log('rawComment is', rawComment);
        // console.log('tags are', tags);
        // console.log('mentioned users are', mentionedUsers);
        // padding tags and mentioned to the end
        let finalCommentText = rawComment;
        tags.map((t) => {
          finalCommentText = finalCommentText.concat(t);
        });
        mentionedUsers.map((u) => {
          finalCommentText = finalCommentText.concat(u);
        });
        console.log('final comment text is', finalCommentText);
        await postLib.commentPost(post._id, activeUser, finalCommentText, tags, mentionedUsers);
      }
      // await postLib.commentPost(post._id, activeUser, rawComment, tags, mentionedUsers);
      // await postLib.commentPost(post._id, activeUser, commentContent, tags, mentionedUsers);
    }
  }

  async function deletePostHandler(comment) {
    console.log('delete comment post is ', post._id);
    console.log('comment need to be deleted is ', comment);
    console.log('comment user is ', activeUser);
    await postLib.deleteCommentPost(post._id, comment);
  }

  // TODO: only logged in user can flag a post!
  async function FlagHandler(event) {
    console.log('id of post to be flagged: ', post._id);

    // flag this post in db
    await postLib.flagPost(post._id, activeUser._id).then((res) => {
      console.log('Successfully flagged a post!', res);
    });

    // frontend show notif on success or failure
    notification.open({
      message: 'Flagged a post!',
      // icon: <SmileTwoTone />,
      type: 'success',
      duration: 2,
      closeIcon: (<div />), // hide the close btn
    });

    // send notification to all admins of this group
    group.administrators.forEach((adminId) => {
      socket?.emit('SendFlagPostNotification', {
        senderId: activeUser._id,
        senderName: activeUser.username,
        receiverId: adminId,
        group: group.name,
      });
    });
  }

  async function hidePosts() {
    // console.log('&&&&&&&&&&&&& this is the function to hide a post');
    setShowPost(false);
    await postLib.hideAPost(post._id, activeUser._id).then((res) => {
      console.log('Successfully hided a post!', res);
      notification.open({
        message: 'Hide a post successfully!',
        // icon: <SmileTwoTone />,
        type: 'success',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    });
  }

  return (
    <div className={classes.container}>
      {post && poster && showPost && activeUser ? (
        <div>
          <div className={classes.topPart}>
            <div className={classes.userInfo}>
              <img alt="pic1" src={userAvatar} />
              <div>
                <div className={classes.userName}>{poster.username}</div>
                <div className={classes.postTimeStamp}>
                  Last modified:
                  {' '}
                  {new Date(post.lastupdated_date).toDateString()}
                </div>
              </div>
            </div>
            <div className={classes.postGroup}>
              <div className={classes.groupInfo}>
                <img alt="pic2" src={groupAvatar} />
                <div>
                  <div className={classes.groupName}>{group.name}</div>
                </div>
              </div>
            </div>
          </div>
          {/* ------Display Text------------ */}
          <div className={classes.postTextArea}>
            <textarea type="textarea" rows="3" readOnly="readonly" value={post.text_content} />
          </div>
          {/* ------Display Attachment--------- */}
          {attachment && attachmentType ? (
            <div className={classes.postFileArea}>
              {attachmentType.match('image/*') ? (
                <img type="attchmentarea" className={classes.postAttachment} alt="pic" src={attachment} />
              ) : null}
              {attachmentType.match('video/*') ? (
                <ReactVideo
                  src={attachment}
                  poster="video"
                  primaryColor="red"
                  className={classes.postAttachment}
                />
              ) : null}
              {attachmentType.match('audio/*') ? (
                <audio controls src={attachment} className={classes.postAttachment}>
                  Your browser does not support the audio tag.
                </audio>
              ) : null}
            </div>
          ) : null}
          {/* ------Display hashtags and handles--------- */}
          {/* TODO add CSS */}
          <div className={classes.bottomPart}>
            {post.hashtags && post.hashtags.length !== 0 ? (
              <>
                {
                  post.hashtags
                    .map((tag) => (
                      <span>
                        #
                        {tag}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ', ', curr])
                }
              </>
            ) : null}
            <hr />
            {post.mentioned && post.mentioned.length !== 0 ? (
              <>
                {
                  post.mentioned
                    .map((user) => (
                      <span>
                        @
                        {user}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ', ', curr])
                }
              </>
            ) : null}
            <div className={classes.bottomPart}>
              <div className={classes.bottomLeftPart}>
                {/* <input required placeholder="Comment Here!" onChange={handleCommentInputChange} /> */}
                {showButtons ? (
                  <MentionsInput
                    required={true}
                    className="mentions"
                    inputRef={tagMentionComment}
                    spellCheck="false"
                    placeholder="Comment Here!"
                    value={commentContent}
                    onChange={(event) => addCommentContent(event.target.value)}
                    style={{
                      backgroundColor: 'white',
                    }}
                  >
                    <Mention
                      trigger="@"
                      data={clickableMembers}
                      markup="@@@____display__"
                      style={{
                        backgroundColor: '#cee4e5',
                      }}
                      displayTransform={(name) => `@${name}`}
                      appendSpaceOnAdd={true}
                    // renderSuggestion={highlightedDisplay}
                    />
                    <Mention
                      trigger="#"
                      data={clickableTags}
                      markup="$$$____display__"
                      style={{
                        backgroundColor: '#cee4e5',
                      }}
                      displayTransform={(tag) => `#${tag}`}
                      appendSpaceOnAdd={true}
                    />
                  </MentionsInput>
                ) : null}
                {/* <div>
                  <div
                    onClick={() => {
                      tagMentionComment.current.focus();
                      setCommentContent((commentContent) => `${commentContent}@`);
                    }}
                    className="mentions_mention"
                  >
                    @
                  </div>
                  <div
                    onClick={() => {
                      tagMentionComment.current.focus();
                      setCommentContent((commentContent) => `${commentContent}#`);
                    }}
                    className="mentions_mention"
                  >
                    #
                  </div>
                </div> */}
              </div>
              {showButtons ? (
                <div className={classes.bottomRightPart}>
                  {/* TODO only members of a group can flag!!! */}
                  {activeUser ? (
                    <div>
                      <button className={classes.postButtons} type="button" onClick={submitHandler}>Submit</button>
                      <button className={classes.postButtons} type="button" onClick={FlagHandler}>Flag</button>
                      <button className={classes.postButtons} type="button" onClick={hidePosts}>Hide</button>
                    </div>
                  ) : null}
                  {isAdmin ? (
                    <button type="button" className={classes.postButtons} onClick={DeleteHandler}>
                      Delete
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

          </div>
          <div className={classes.commentList}>
            {comments ? (
              comments.map((comment) => (
                <div className={classes.commentLine}>
                  <li>
                    <b>{comment.username}</b>
                    {' '}
                    :
                    {' '}
                    {comment.content}
                  </li>
                  {activeUser && comment.user_Id === activeUser._id ? (
                    <div>
                      {showButtons ? (
                        <>
                          <Popover
                            content={(
                              <div>
                                <Input placeholder="Edit Comment Here!" onChange={handlePopoverChange} />
                                <button type="button" className={classes.postButtons} onClick={() => editConfirmHandler(comment)}>Confirm</button>
                              </div>
                            )}
                            title=""
                            trigger="click"
                          >
                            <button type="button" className={classes.postButtons}>edit</button>
                          </Popover>
                          <button type="button" className={classes.postButtons} onClick={() => deletePostHandler(comment)}>delete</button>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostItem;
