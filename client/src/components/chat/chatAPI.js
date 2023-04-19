/* eslint-disable camelcase */
const axios = require('axios');

// const serverUrl = 'http://localhost:5000/api/';
const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

async function startChat(user1_id, user2_id, message) {
  console.log('in API startChat');
  const url = `${serverUrl}chats`;
  console.log(`url is ${url}`);
  const chatInfo = {};
  chatInfo.user1_id = user1_id;
  chatInfo.user2_id = user2_id;
  chatInfo.message = message;
  try {
    const res = await axios.post(url, chatInfo);
    console.log('make a new chat', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

async function startChatWithFile(formData) {
  try {
    console.log('in postAPI makePost with file');
    const url = `${serverUrl}chats/chatswithfile`;
    console.log(`url is ${url}`);
    console.log('messageInfo is ', formData);
    // const chatInfo = {};
    // chatInfo.user1_id = user1_id;
    // chatInfo.user2_id = user2_id;
    // chatInfo.message = message;
    const res = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('makepost res is ', res);
    return res.data;
  } catch (err) {
    console.log('error in start chats with file');
    return err;
  }
}

async function findChatByUsers(user1_id, user2_id) {
  console.log('in API getChats');
  const url = `${serverUrl}chats/user1/${user1_id}/user2/${user2_id} `;
  try {
    const res = await axios.get(url);
    console.log('chats are', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

async function updateMessage(user1_id, user2_id, lastUpdatedTime, newMessage) {
  console.log('update the new message');
  const url = `${serverUrl}chats/user1/${user1_id}/user2/${user2_id} `;
  console.log('url is', url);
  const newChatInfo = {};
  newChatInfo.lastupdated_date = lastUpdatedTime;
  newChatInfo.newMessage = newMessage;
  try {
    const res = await axios.put(url, newChatInfo);
    console.log('updated chats are', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

async function updateChatsWithFile(user1_id, user2_id, formData) {
  try {
    console.log('in postAPI makePost with file');
    const url = `${serverUrl}chats/user1/${user1_id}/user2/${user2_id}/chatswithfile`;
    console.log(`url is ${url}`);
    console.log('messageInfo is ', formData);
    const res = await axios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }); console.log('makepost res is ', res);
    return res.data;
  } catch (err) {
    console.log('error in start chats with file');
    return err;
  }
}

async function getAttachmentByName(name) {
  console.log('in chatAPI getAttachmentByName');
  const url = `${serverUrl}files/${name}`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.get(url);
    // do not return res.data, it will not display correctly
    // will use the url and use that as the src
    // console.log('res is', res);
    return url;
  } catch (err) {
    console.log('attachment err is', err.response.data.error);
    return err;
  }
}

export default {
  startChat, findChatByUsers, updateMessage, startChatWithFile, updateChatsWithFile, getAttachmentByName,
};
