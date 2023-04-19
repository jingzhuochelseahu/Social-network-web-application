/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
import React, {
  useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FrownOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import groupLib from '../group/groupAPI';
import ContactList from './ContactList';
import Conversation from './Conversation';
import chatLib from './chatAPI';
import userLib from '../user/userAPI';
import './Chat.css';

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

function Chat() {
  // get the socket connection
  const socket = useSelector((state) => state.socket);
  // const activeUser = useSelector((state) => state.activeUser);
  const [activeUser, setActiveUser] = useState();
  const [file, setFile] = useState();
  // get the current groupId
  const { groupid, userid } = useParams();
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [chatContent, setChatContent] = useState(null);
  const [messageReceiver, setMessageReceiver] = useState(null);

  // fetch activeUser info from db, need to do this since user data might change, eg. groups they are in
  useEffect(async () => {
    console.log('in Chat, userid in params is ', userid);
    await (userLib.getUserById(userid)).then((res) => {
      console.log('activeUser is now', res);
      setActiveUser(res);
    });
  }, []);

  useEffect(async () => {
    await groupLib.getGroupById(groupid).then((res) => {
      setCurrentGroup(res);
    });
  }, []);

  const getMessageContent = (e) => {
    setMessageContent(e.target.value);
  };

  // event handler for file selection
  const updateFile = (e) => {
    console.log('in updateFile, e.target is ', e.target);
    setFile(e.target.files[0]);
  };

  function checkType() {
    console.log('file type is', file.type);
    const filetype = file.type.match('image.*') || file.type.match('audio.*') || file.type.match('video.*');
    if (!filetype) {
      notification.open({
        message: 'File type is not supported!',
        icon: <FrownOutlined />,
        type: 'failed to upload a file',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    }
    const sizelimit = file.size / 1024 / 1024 < 20;
    if (!sizelimit) {
      notification.open({
        message: 'Maximum size is 20MB!',
        icon: <FrownOutlined />,
        type: 'failed to upload a file',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    }
    return filetype && sizelimit;
  }

  function clearMessage() {
    // clear input box
    const textBox = document.getElementById('messageId');
    textBox.value = '';
    setMessageContent(null);
    // clear input file name
    const fileInfo = document.getElementById('upld');
    fileInfo.value = '';
    setFile();
  }

  const handleStartChat = async () => {
    // get the exact time
    const currentDateTime = new Date().toLocaleString('en-US');
    // create new formdata object
    console.log('in handleSubmit');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@file is', file);
    console.log('text is', messageContent);

    if (!messageContent && !file) {
      console.log('no text and no file!');
      notification.open({
        message: 'Must have some text contents or a file!',
        type: 'warning',
        duration: 3,
        closeIcon: (<div />), // hide the close btn
      });
      // clearTexts();
      return;
    }

    // if there is a file attachment
    if (file) {
      if (!checkType()) {
        clearMessage();
        return;
      }

      // get all the information of the chat
      const formData = new FormData();
      formData.append('user1_id', activeUser._id);
      formData.append('user2_id', messageReceiver._id);
      formData.append('from', activeUser._id);
      formData.append('to', messageReceiver._id);
      formData.append('created_date', currentDateTime);
      formData.append('content', messageContent);
      formData.append('attachment_id', file.filename);
      formData.append('attachment_type', file.type);
      formData.append('file', file);
      // formData.append('message', newMessageObj);
      for (const value of formData.values()) {
        console.log('$$$$$$$$$$$$$$$', value);
      }

      if (activeUser && messageReceiver) {
        const existingChat = await chatLib.findChatByUsers(activeUser._id, messageReceiver._id);

        if (existingChat !== null) {
          console.log('existing chat is', existingChat);
          await chatLib.updateChatsWithFile(activeUser._id, messageReceiver._id, formData);
          // update the new message
          const updatedChat = await chatLib.findChatByUsers(activeUser._id, messageReceiver._id);
          setChatContent(updatedChat);
        } else {
          // get the message object
          await chatLib.startChatWithFile(formData);
          const newChat = await chatLib.findChatByUsers(activeUser._id, messageReceiver._id);
          setChatContent(newChat);

          // update two users's chat attribute
          const newSenderChatInfo = {};
          activeUser.chats.push(newChat._id);
          newSenderChatInfo.chats = activeUser.chats;
          await userLib.updateUserByAttrib(activeUser._id, newSenderChatInfo);

          const newReceiverChatInfo = {};
          messageReceiver.chats.push(newChat._id);
          newReceiverChatInfo.chats = messageReceiver.chats;
          await userLib.updateUserByAttrib(messageReceiver._id, newReceiverChatInfo);
        }

        clearMessage();
        // send notification to the receiver
        if (currentGroup && activeUser) {
          socket?.emit('SendMessageNotification', {
            senderId: activeUser._id,
            senderName: activeUser.username,
            receiverId: messageReceiver._id,
            group: currentGroup.name,
          });
        }
      }
    } else {
      // get the current message
      const message = {};
      message.from = userid;
      message.to = messageReceiver._id;
      message.created_date = currentDateTime;
      message.content = messageContent;
      message.attachment_id = '';
      message.attachment_type = '';

      if (activeUser && messageReceiver) {
        const existingChat = await chatLib.findChatByUsers(activeUser._id, messageReceiver._id);

        if (existingChat !== null) {
          console.log('existing chat is', existingChat);
          await chatLib.updateMessage(activeUser._id, messageReceiver._id, currentDateTime, message);
          // update the new message
          existingChat.lastupdated_date = currentDateTime;
          existingChat.message.push(message);
          setChatContent(existingChat);
        } else {
          // get the message object
          await chatLib.startChat(activeUser._id, messageReceiver._id, message);
          const newChat = await chatLib.findChatByUsers(activeUser._id, messageReceiver._id);
          setChatContent(newChat);

          // update two users's chat attribute
          const newSenderChatInfo = {};
          activeUser.chats.push(newChat._id);
          newSenderChatInfo.chats = activeUser.chats;
          await userLib.updateUserByAttrib(activeUser._id, newSenderChatInfo);

          const newReceiverChatInfo = {};
          messageReceiver.chats.push(newChat._id);
          newReceiverChatInfo.chats = messageReceiver.chats;
          await userLib.updateUserByAttrib(messageReceiver._id, newReceiverChatInfo);
        }

        clearMessage();
        // send notification to the receiver
        if (currentGroup && activeUser) {
          socket?.emit('SendMessageNotification', {
            senderId: activeUser._id,
            senderName: activeUser.username,
            receiverId: messageReceiver._id,
            group: currentGroup.name,
          });
        }
      }
    }
  };

  return (
    <div className="ChatMainPage">
      {activeUser ? (
        <>
          <div className="ChatList">
            Choose a user to start a chat
            {currentGroup ? (
              <ContactList activeUser={activeUser} currentGroup={currentGroup} setChatContent={setChatContent} setMessageReceiver={setMessageReceiver} />
            ) : null}
          </div>
          <div className="ChatArea">
            <div className="ChatExhibition">
              {chatContent !== null ? (
                <Conversation activeUser={activeUser} chatContent={chatContent} messageReceiver={messageReceiver} />
              ) : null}
            </div>
            <div className="ChatInput">
              <input id="messageId" className="EnterMessage" typt="text" placeholder="Enter your message" onChange={(e) => getMessageContent(e)} />
              <div>
                Upload Image/Audio/Video
                <input
                  id="upld"
                  type="file"
                  name="file"
                  onChange={(e) => updateFile(e)}
                />
              </div>
              <button type="button" className="StartChat" onClick={() => handleStartChat()}>submit</button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Chat;
