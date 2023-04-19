// axios functions for group related features
const axios = require('axios');

const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

async function getGroups() {
  console.log('in groupAPI getGroups');
  const url = `${serverUrl}groups`;
  // const url = '/groups';
  console.log(`url is ${url}`);
  try {
    const res = await axios.get(url);
    console.log('groups are', res.data.data);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

// create a new Group
async function createNewGroup(name, type, tags, image, currentUser) {
  const newGroup = {};
  newGroup.groupname = name;
  newGroup.public = type;
  newGroup.tags = tags;
  newGroup.profile_image = image;
  newGroup.userId = currentUser;
  console.log(currentUser);
  try {
    const url = `${serverUrl}group`;
    const data = await fetch(url, { method: 'POST', body: JSON.stringify(newGroup), headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then((result) => result);
    return data;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

async function getGroupById(id) {
  console.log('in group API getGroupById');
  try {
    const url = `${serverUrl}groups/${id}`;
    const res = await axios.get(url);
    // console.log('getGroupById res is ', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

async function sortGroups(attrib, order) {
  console.log('in group API sortGroups');
  try {
    const url = `${serverUrl}groups/sort/${attrib}/${order}`;
    const res = await axios.get(url);
    console.log('sortGroups res is ', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

async function updateGroup(id, groupInfo) {
  try {
    console.log('in groupAPI updateGroup');
    const url = `${serverUrl}groups/${id}`;
    console.log('^^^^^^^^^^^^^ URL is', url);
    const res = await axios.put(url, groupInfo);
    console.log('group updated ', res);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

// fix this
async function getRequests(id) {
  console.log('in get all pending requests');
  try {
    const url = `${serverUrl}groups/${id}/requests`;
    const res = await axios.get(url);
    console.log('pending requests are ', res.data.data);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

export default {
  getGroups, createNewGroup, getGroupById, sortGroups, updateGroup, getRequests,
};
