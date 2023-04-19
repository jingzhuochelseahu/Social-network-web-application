// axios functions for group related features
const axios = require('axios');

const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

async function getRequests() {
  console.log('in reqeustAPI getRequests');
  const url = `${serverUrl}requests`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.get(url);
    console.log(`requests are ${res.data}`);
    return res.data;
  } catch (reason) {
    return reason;
  }
}

// create a new Group
async function createRequest(userId, groupId, username) {
  const newRequest = {};
  newRequest.userId = userId;
  newRequest.groupId = groupId;
  newRequest.username = username;
  console.log(newRequest);
  try {
    const url = `${serverUrl}requests`;
    const data = await fetch(url, { method: 'POST', body: JSON.stringify(newRequest), headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then((result) => result);
    console.log(data);
    return data;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

async function getRequestsById(groupId) {
  console.log('in requestAPI getRequestsById');
  try {
    const url = `${serverUrl}requests/groupId/${groupId}`;
    const res = await axios.get(url);
    console.log('getRequestsById res is ', res.data.data);
    return res.data;
  } catch (err) {
    return err;
  }
}

async function deleteRequest(id) {
  console.log('in reqeustAPI deleteRequest');
  try {
    const url = `${serverUrl}requests/${id}`;
    const res = await axios.delete(url);
    // console.log('getGroupById res is ', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

export default {
  createRequest, getRequests, getRequestsById, deleteRequest,
};
