/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useSelector } from 'react-redux';
// import { message } from 'antd';
import Message from './Message';
import DefaultUserAvatar from '../defaultAvatar.jpeg';
import './conversation.css';

function Conversation(props) {
  const { activeUser, chatContent, messageReceiver } = props;
  // const activeUser = useSelector((state) => state.activeUser);

  return (
    <div>
      {chatContent.message.length > 0 ? (
        <div className="MessageBoard">
          {chatContent.message.map((message) => (
            <Message activeUser={activeUser} messageReceiver={messageReceiver} message={message} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Conversation;
