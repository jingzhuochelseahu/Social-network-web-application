/* eslint-disable consistent-return */
// axios functions for user model related features
import React from 'react';
import {
  notification,
} from 'antd';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const axios = require('axios');

// const serverUrl = 'http://localhost:5000/api/';
const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

// async function getAllUsers() {
//   try {
//     const url = `${serverUrl}users`;
//     console.log('in userAPI getAllUsers. url is ', url);
//     const res = await axios.get(url);
//     return res.data.data;
//   } catch (error) {
//     console.log('no users yet');
//     console.log(error);
//     return '';// return '' so whoever wants this user info can tell and display nothing
//   }
// }

async function getUserById(id) {
  try {
    const url = `${serverUrl}users/${id}`;
    console.log('in userAPI getUserById. url is ', url);
    const res = await axios.get(url);
    console.log('getUserById res is ', res.data.data);
    return res.data.data;
  } catch (error) {
    console.log('no such user, account might be deactivated');
    console.log(error);
    return '';// return '' so whoever wants this user info can tell and display nothing
  }
}

async function getUserByName(username) {
  try {
    const url = `${serverUrl}users/name/${username}`;
    const res = await axios.get(url);
    console.log('getUserByName res is ', res.data.data);
    return res.data.data;
  } catch (error) {
    notification.open({
      message: error.response.data.error,
      type: 'error',
      duration: 3,
      closeIcon: (<div />), // hide the close btn
    });
    return '';// return '' so whoever wants this user info can tell and display nothing
  }
}

async function updateUserByAttrib(id, newUser) {
  try {
    console.log('in API updateUserByAttrib');
    console.log('newUser is', newUser);
    const url = `${serverUrl}users/${id}`;
    console.log(`url is ${url}`);
    const res = await axios.put(url, newUser);
    console.log('updateUserByAttrib res is ', res);
    return res.data.data;
  } catch (error) {
    return error;
  }
}

async function deleteUserAndRelated(id) {
  try {
    console.log('in userAPI deleteUserAndRelated');
    const url = `${serverUrl}users/${id}`;
    const res = await axios.delete(url);
    console.log('deleteUserAndRelated res is ', res.data.data);
    return res.data.data;
  } catch (error) {
    notification.open({
      message: error.response.data.error,
      type: 'error',
      duration: 3,
      closeIcon: (<div />), // hide the close btn
    });
    // return error;
  }
}

// export default { getUserById, getUserByName };
export default {
  getUserByName, getUserById, updateUserByAttrib, deleteUserAndRelated,
};
