// axios functions for group related features
const axios = require('axios');

const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

async function getInvites() {
  console.log('in invitesAPI getInvites');
  const url = `${serverUrl}invites`;
  console.log(`url is ${url}`);
  try {
    const res = await axios.get(url);
    console.log('requests are', res.data.data);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

// create a new Group
async function createInvite(invitedId, invitingId, groupId, groupname) {
  const newinviteRequest = {};
  newinviteRequest.invitedId = invitedId;
  newinviteRequest.invitingId = invitingId;
  newinviteRequest.groupId = groupId;
  newinviteRequest.groupname = groupname;
  console.log(newinviteRequest);
  try {
    const url = `${serverUrl}invites`;
    const data = await fetch(url, { method: 'POST', body: JSON.stringify(newinviteRequest), headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then((result) => result);
    return data;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

async function getInvitesById(invitedId) {
  console.log('in invitesAPI getInvitesById');
  try {
    const url = `${serverUrl}invites/invitedId/${invitedId}`;
    const res = await axios.get(url);
    console.log('getRequestsById res is ', res.data.data);
    return res.data;
  } catch (err) {
    return err;
  }
}

async function deleteInvite(id) {
  console.log('in inviteAPI deleteInvite');
  try {
    const url = `${serverUrl}invites/${id}`;
    const res = await axios.delete(url);
    return res.data.data;
  } catch (err) {
    return err;
  }
}

export default {
  getInvites, createInvite, getInvitesById, deleteInvite,
};
