// used for displaying a single post item that was posted by a user in this user's profile page
// different from PostItem, since it does not support any clickable functionalities
// TODO: fix css
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { ReactVideo } from 'reactjs-media';
import './PostExhibitionItem.css';
import userLib from './userAPI';
import groupLib from '../group/groupAPI';
import postLib from '../post/postAPI';
import DefaultUserAvatar from '../defaultAvatar.jpeg';

function PostExhibitionItem(props) {
  const { post } = props;
  const [poster, setPoster] = useState(); // user who made this post
  const [group, setGroup] = useState(); // user who made this post

  const [userAvatar, setUserAvatar] = useState(DefaultUserAvatar);
  const [attachment, setAttachment] = useState();
  const [attachmentType, setAttachmentType] = useState();

  const dateFormatOptions = {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  };
  // fetch user who posted this post
  useEffect(async () => {
    await userLib.getUserById(post.user_id).then((res) => {
      // console.log('poster is ', res);
      if (res !== '') {
        setPoster(res);
        if (res.profile_image) setUserAvatar(res.profile_image);
      }
    });
  }, []);
  // fetch group this post belongs to
  useEffect(async () => {
    await groupLib.getGroupById(post.group_id).then((res) => {
      // console.log('group is ', res);
      if (res) {
        setGroup(res);
      }
    });
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

  return (
    <div className="Post-Section">
      {poster && group ? (
        <>
          <div className="topPart">
            <div className="userInfo">
              <img alt="pic1" src={userAvatar} />
              {poster.username}
            </div>
            <div className="postTimeDiv">
              {/* <div className="userName">{poster.username}</div> */}
              <div className="userName" />
              <div className="postTimeStamp">
                Last modified:
                {' '}
                {new Date(post.lastupdated_date).toLocaleDateString('en-US', dateFormatOptions)}
              </div>
            </div>
            <div className="postGroup">
              <div className="groupInfo">
                <img alt="pic2" src={group.profile_image} />
                {group.name}
                {/* <div className="groupName">{group.name}</div> */}
              </div>
            </div>
          </div>
          {/* ------Display Text------------ */}
          <div className="postTextArea">
            <textarea type="textarea" rows="3" readOnly="readonly" value={post.text_content} />
          </div>
          {/* ------Display Attachment--------- */}
          {attachment && attachmentType ? (
            <div className="postFileArea">
              {attachmentType.match('image/*') ? (
                <img type="attchmentarea" className="PostImg" alt="pic" src={attachment} />
              ) : null}
              {attachmentType.match('video/*') ? (
                <ReactVideo
                  src={attachment}
                  poster="video"
                  primaryColor="red"
                />
              ) : null}
              {attachmentType.match('audio/*') ? (
                <audio controls src={attachment}>
                  Your browser does not support the audio tag.
                </audio>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
export default PostExhibitionItem;
