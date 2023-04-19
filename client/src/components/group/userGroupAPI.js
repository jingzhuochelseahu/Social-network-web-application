import axios from 'axios';

// const serverUrl = 'http://localhost:5000/';
const serverUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';

// add current user to Public Group
// add current id to group's request array
// add group id with status to the user public_group
// status 0:pending, 1:accepted 2:denied
async function addUserToPublicGroup(activeUser, currGroup) {
  const userUrl = `${serverUrl}users/${activeUser._id}`;
  const groupUrl = `${serverUrl}groups/${currGroup._id}`;
  const groupId = currGroup._id;
  console.log(`active user to add is ${activeUser.data}`);
  if (activeUser.public_groups.length !== 0) {
    activeUser.public_groups.push({ groupId });
    console.log('pushed new public group');
  } else {
    console.log('This old user have no publicGroup attribute!!!');
  }
  // change userInfo and groupInfo
  try {
    const res1 = await axios.put(userUrl, activeUser);
    console.log('Requested to add publicGroupId to userInfo:', res1);
    const res2 = await axios.put(groupUrl, currGroup);
    console.log('Requested to add userId to currGroup:', res2);
    return [activeUser, currGroup];
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function leaveUserFromPublicGroup(currentUser, currGroup) {
  console.log('in userGroupAPI leaveUserFromPublicGroup');
  console.log(currentUser._id);
  console.log(currGroup._id);
  const userUrl = `${serverUrl}users/${currentUser._id}`;
  const groupUrl = `${serverUrl}groups/${currGroup._id}`;
  // the reason why copy a new variable is that:
  // ESLint prohibit modifing variables which was passed as parameters.
  console.log(`original public groups are ${currentUser.public_groups}`);
  if (currentUser.public_groups) {
    // delete relevant ids
    const updatedUserPublicGroups = currentUser.public_groups.filter((item) => item !== currGroup._id);
    const newActiveUser = { public_groups: updatedUserPublicGroups };
    console.log(`new public groups are ${updatedUserPublicGroups}`);
    const updatedGroupMembers = currGroup.members.filter((item) => item !== currentUser._id);
    const newCurrGroup = { members: updatedGroupMembers };
    console.log(`new members of this group are ${updatedGroupMembers}`);
  } else {
    console.log('This old user have no publicGroup attribute!!!');
  }
  try {
    const res1 = await axios.put(userUrl, newActiveUser);
    console.log('Requested to add publicGroupId to userInfo:', res1);
    const res2 = await axios.put(groupUrl, newCurrGroup);
    console.log('Requested to add userId to currGroup:', res2);
    return [newActiveUser, newCurrGroup];
  } catch (e) {
    console.log(e);
    return e;
  }
}

export default { addUserToPublicGroup, leaveUserFromPublicGroup };
