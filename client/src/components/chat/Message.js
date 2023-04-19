/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { ReactVideo } from 'reactjs-media';
import { useSelector } from 'react-redux';
import DefaultUserAvatar from '../defaultAvatar.jpeg';
import chatLib from './chatAPI';
import './conversation.css';

function Message(props) {
  const { activeUser, messageReceiver, message } = props;
  const SenderAvatar = (activeUser && activeUser.profile_image !== '') ? activeUser.profile_image : DefaultUserAvatar;
  const ReceiverAvatar = (messageReceiver && messageReceiver.profile_image !== '') ? messageReceiver.profile_image : DefaultUserAvatar;

  const [attachment, setAttachment] = useState();
  const [attachmentType, setAttachmentType] = useState();

  // fetch attachment file for this post, if exist
  useEffect(async () => {
    console.log('post is ', message);
    if (message.attachment_id && message.attachment_type) {
      await chatLib.getAttachmentByName(message.attachment_id).then((res) => {
        // attachment is not working, but after going to office hour, using url will just work
        // console.log('attachment url is ', res.url);
        setAttachment(res);
        setAttachmentType(message.attachment_type);
      }).catch((err) => {
        console.log('err is', err);
      });
    } else {
      console.log('this post has no attachment');
    }
  }, []);

  return (
    <>
      <img
        className="messageImg"
        src={message.from === activeUser._id ? SenderAvatar : ReceiverAvatar}
        alt=""
      />
      <div className={message.from === activeUser._id ? 'MessageContent_Own' : 'MessageContent'}>
        <div>
          {message.content.length !== 0 ? (
            message.content
          ) : ''}
        </div>
        {attachment && attachmentType ? (
          <div>
            {attachmentType.match('image/*') ? (
              <img className="ChatAttachment" type="attchmentarea" alt="pic" src={attachment} />
            ) : null}
            {attachmentType.match('video/*') ? (
              <ReactVideo
                src={attachment}
                poster="video"
                primaryColor="red"
                className="ChatAttachment"
              />
            ) : null}
            {attachmentType.match('audio/*') ? (
              <audio controls src={attachment} className="ChatAttachment">
                <track default kind="caption" src="" />
                Your browser does not support the audio tag.
              </audio>
            ) : null}
          </div>
        ) : null}
        <p>{message.created_date}</p>
      </div>
    </>

  );
}

export default Message;
