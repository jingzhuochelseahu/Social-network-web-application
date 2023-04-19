/* eslint-disable space-infix-ops */
// axios functions for post related features
import React from 'react';
import {
  notification,
} from 'antd';

const axios = require('axios');

// const serverUrl = 'http://localhost:5000/api/';
const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

async function getPosts() {
  console.log('in postAPI getPosts');
  const url = `${serverUrl}posts`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.get(url);
    console.log('posts are', res.data.data);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

async function getPostById(id) {
  try {
    const url = `${serverUrl}posts/${id}`;
    console.log('in postAPI getPostById. url is ', url);
    const res = await axios.get(url);
    console.log('getPostById res is ', res.data.data);
    return res.data.data;
  } catch (error) {
    // console.log(error);
    return err;
  }
}

// new version1: postInfo is a formData
async function makePostWithFile(groupId, postInfo) {
  try {
    console.log('in postAPI makePost with file');
    const url = `${serverUrl}groups/${groupId}/postswithfile`;
    console.log(`url is ${url}`);
    console.log('postInfo is ', postInfo);
    const res = await axios.post(url, postInfo, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('makepost res is ', res);
    return res.data;
  } catch (err) {
    notification.open({
      message: err.response.data.error,
      type: 'error',
      duration: 3,
      closeIcon: (<div />), // hide the close btn
    });
    console.log('error here in api');
    return err;
  }
}

// version2, post without file
async function makePost(groupId, postInfo) {
  try {
    console.log('in postAPI makePost without file');
    const url = `${serverUrl}groups/${groupId}/posts`;
    console.log(`url is ${url}`);
    console.log('postInfo is ', postInfo);
    const res = await axios.post(url, postInfo);
    console.log('makepost res is ', res);
    return res.data;
  } catch (err) {
    notification.open({
      message: err.response.data.error,
      type: 'error',
      duration: 3,
      closeIcon: (<div />), // hide the close btn
    });
    console.log('error here in api');
    return err;
  }
}

async function getPostsByGroupId(id) {
  console.log('in postAPI getPostsByGroupId');
  const url = `${serverUrl}groups/${id}/posts`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.get(url);
    console.log('posts in this group are', res.data.data);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

// get file attachment for a post by file name
async function getAttachmentByName(name) {
  console.log('in postAPI getAttachmentByName');
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

// delete a post
async function deletePost(id) {
  console.log('in postAPI deletePost');
  const url = `${serverUrl}posts/${id}`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.delete(url);
    console.log('deletepost res is ', res);
    return res;
  } catch (err) {
    notification.open({
      message: err.response.data.error,
      type: 'error',
      duration: 3,
      closeIcon: (<div />), // hide the close btn
    });
    return err;
  }
}

async function commentPost(postId, activeUser, text, tags, mentioned) {
  console.log('in postAPI commentPost');
  const url = `${serverUrl}posts/${postId}`;
  console.log(`url is ${url}`);
  const comment = {
    user_Id: activeUser._id,
    username: activeUser.username,
    content: text,
    hashtags: tags,
    mentioned,
  };
  const body = {
    comment,
    type: 'add',
  };
  console.log('wrapped body is ', body);
  try {
    const res = await axios.put(url, body);
    console.log('Requested to comment a post', res.data.data);
    return res.data.data;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function commentEdit(postId, activeUser, oldComment, text) {
  console.log('in postAPI commentEdit');
  const url = `${serverUrl}posts/${postId}`;
  console.log(`url is ${url}`);
  const newComment = {
    user_Id: activeUser._id,
    username: activeUser.username,
    content: text,
  };
  const body = {
    oldComment,
    newComment,
    type: 'edit',
  };
  console.log('warped body is ', body);
  try {
    const res = await axios.put(url, body);
    console.log('Requested to edit a post', res.data.data);
    return res.data.data;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function deleteCommentPost(postId, comment) {
  console.log('in postAPI deleteCommentPost');
  const url = `${serverUrl}posts/${postId}`;
  console.log(`url is ${url}`);
  const body = {
    comment,
    type: 'delete',
  };
  console.log('warped body is ', body);
  try {
    const res = await axios.put(url, body);
    console.log('Requested to delete a comment in the post', res.data.data);
    return res.data.data;
  } catch (e) {
    console.log(e);
    return e;
  }
}

// request to flag a post by id, will change flag of this post to be 1 and set flagger id
// TODO, now only supports one flagger
async function flagPost(postId, flaggerId) {
  console.log('in postAPI flagPost, is actually a updatePost operation');
  const url = `${serverUrl}posts/${postId}`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.put(url, {
      flag: 1,
      flagger: flaggerId,
    });
    console.log('Requested to flag a post', res.data.data);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

async function unflagPost(postId) {
  console.log('in postAPI unflagPost, try useing updatePost');
  const url = `${serverUrl}posts/${postId}`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.put(url, {
      flag: 0,
    });
    console.log('Requested to unflag a post', res.data.data);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

async function getFlaggedPostsByGroupId(id) {
  console.log('in postAPI getFlaggedPostsByGroup');
  const url = `${serverUrl}groups/${id}/flaggedposts`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.get(url);
    console.log('flgged posts for this group are', res.data.data);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

// function to make the post in hide status
async function hideAPost(postId, userId) {
  console.log('((((((((((((((((((((in postAPI hide a post');
  const url = `${serverUrl}posts/${postId}`;
  try {
    const res = await axios.put(url, { type: 'hide', hider: userId });
    console.log('Requested to hide a post', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

export default {
  getPosts, getPostById, makePost, commentEdit, makePostWithFile, deleteCommentPost, commentPost, getPostsByGroupId, deletePost, getFlaggedPostsByGroupId, flagPost, unflagPost, getAttachmentByName, hideAPost,
};
