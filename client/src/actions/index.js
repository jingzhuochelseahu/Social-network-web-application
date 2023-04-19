// const loginActiveUser = (user) => ({
//   type: 'USER_LOGIN',
//   user,
// });

// const logOutActiveUser = (user) => ({
//   type: 'USER_LOGOUT',
//   user,
// });

const setGroupFilter = (tags) => ({
  type: 'SET_GROUP_FILTER',
  tags,
});

const addGroup = (group) => ({
  type: 'ADD_GROUP',
  group,
});

const deleteGroup = (id) => ({
  type: 'DELETE_GROUP',
  id,
});

// // a user requests to flag a post
// const requestFlagPost = (info) => ({
//   type: 'REQUEST_FLAG',
//   flagger_id: info.user,
//   post_id: info.post,
// });

// // an admin deletes a flagged post
// const deleteFlaggedPost = (info) => ({
//   type: 'DELETE_FLAG',
//   post: info.post,
//   flagger: info.flagger,
//   poster: info.poster,
// });

// // a user, either poster or flagger, is notified of a flagged post being deleted
// const notifyDeleteDone = (info) => ({
//   type: 'NOTIFY_DELETE_DONE',
//   post: info.post,
//   flagger: info.flagger,
//   poster: info.poster,
// });

// // an admin unflags a flagged post
// const unflagPost = (info) => ({
//   type: 'UNFLAG',
//   flagger: info.flagger,
//   post: info.post,
// });

// // the flagger is notified of a flagged post being unflagged
// const notifyUnflagDone = (info) => ({
//   type: 'NOTIFY_UNFLAG_DONE',
//   post: info.post,
//   flagger: info.flagger,
// });

// the admin approves request
const approveRequest = (info) => ({
  type: 'APPROVE_REQUEST',
  user: info.user,
  group: info.group,
});

// the admin denies request
const denyRequest = (info) => ({
  type: 'DENY_REQUEST',
  user: info.user,
  group: info.group,
});

// the user is notified request denied
const notifyRequestDenied = (info) => ({
  type: 'NOTIFY_REQUEST_DENIED',
  user: info.user,
  group: info.group,
});

// the user is notified request denied
const notifyRequestApproved = (info) => ({
  type: 'NOTIFY_REQUEST_APPROVED',
  user: info.user,
  group: info.group,
});

// const connectToSocket = (socket) => ({
//   type: 'SOCKET_CONNECT',
//   socket,
// });

const socketConnection = (socket) => ({
  type: 'SOCKET_CONNECT',
  socket,
});

const SocketDisconnection = (socket) => ({
  type: 'SOCKET_DISCONNECT',
  socket,
});

module.exports = {
  setGroupFilter,
  addGroup,
  deleteGroup,
  approveRequest,
  denyRequest,
  notifyRequestApproved,
  notifyRequestDenied,
  socketConnection,
  SocketDisconnection,
};
