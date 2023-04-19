/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { activeMessageReceiver } from '../../actions';
import chatLib from './chatAPI';
import './Chat.css';

function Contact(props) {
  const {
    activeUser, contacts, setChatContent, setMessageReceiver,
  } = props;
  // const activeUser = useSelector((state) => state.activeUser);
  const dispatch = useDispatch();

  const handleOnClick = async (user) => {
    console.log('%%%%%%%%%%% Hello');
    setMessageReceiver(user);

    await chatLib.findChatByUsers(activeUser._id, user._id).then(async (existingChat1) => {
      if (existingChat1 !== null) {
        setChatContent(existingChat1);
      } else {
        await chatLib.findChatByUsers(user._id, activeUser._id).then((existingChat2) => {
          if (existingChat2 !== null) {
            setChatContent(existingChat2);
          } else {
            setChatContent(null);
          }
        });
      }
    });
  };

  return (
    <div className="Contact">
      {contacts.length > 0 ? (
        <div>
          {contacts.map((member) => (
            <div className="ContactInformation" onClick={() => handleOnClick(member)}>
              <img className="UserImg" alt="pic1" src={member.profile_image} />
              {member.username}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Contact;
