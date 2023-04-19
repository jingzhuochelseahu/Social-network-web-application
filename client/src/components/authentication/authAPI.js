/* eslint-disable consistent-return */
// axios functions for user authentication related features
import React from 'react';
import {
  notification,
} from 'antd';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import jwtDecode from 'jwt-decode';

const axios = require('axios');

// const serverUrl = 'http://localhost:5000/api/';
const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

// TODO add profileimage to params later
async function signUp(email, password, fullname, username) {
  try {
    console.log('in API signUp');
    const url = `${serverUrl}registration`;
    const newUser = {
      email,
      username,
      fullname,
      password,
    };
    console.log(`url is ${url}`);
    const res = await axios.post(url, newUser);
    console.log('signup res is ', res);
    return res.data.data;
  } catch (error) {
    notification.open({
      message: error.response.data.error,
      type: 'error',
      duration: 3,
      closeIcon: (<div />), // hide the close btn
    });
    // return err;
  }
}

async function logIn(username, password) {
  try {
    console.log('in API logIn');
    const url = `${serverUrl}login`;
    console.log(`url is ${url}`);
    const info = {
      username,
      password,
    };
    const res = await axios.post(url, info);
    console.log('login res is ', res);
    return res.data.data;
  } catch (error) {
    notification.open({
      message: error.response.data.error,
      type: 'error',
      duration: 3,
      closeIcon: (<div />), // hide the close btn
    });
    // return err;
  }
}

function getCurrentUserFromStorage() {
  console.log('in authAPI getCurrentUserFromStorage');
  const userInfo = localStorage.getItem('currentUser');
  // if (token) return jwtDecode(token);
  // return null;
  return JSON.parse(userInfo);
}

function logout() {
  console.log('in authAPI logout');
  localStorage.removeItem('currentUser');
  // delete this.defaults.headers.common.token;
  return true;
}

export default {
  signUp, logIn, getCurrentUserFromStorage, logout,
};
