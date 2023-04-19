/* eslint-disable default-param-last */
// a store for all the global states
import { combineReducers } from 'redux';

// export const activeUser = (state = null, action) => {
//   console.log('in reducer activeUser');
//   switch (action.type) {
//     case 'USER_LOGIN':
//       console.log(`in reducers activeUser login. user is ${action.user}`);
//       return action.user;
//     case 'USER_LOGOUT':
//       console.log(`in reducers activeUser logout. user is ${action.user}`);
//       return null;
//     default:
//       return state;
//   }
// };

// a list of all groups in db
export const groups = (state = [], action) => {
  // console.log('in reducer groups');
  switch (action.type) {
    case 'ADD_GROUP':
      return [
        ...state,
        {
          group: action.group,
        },
      ];
    case 'DELETE_GROUP':
      return state.filter((group) => ((group.id !== action.id)));
    default:
      return state;
  }
};

// list of group tags to filter on
// TODO, now only 1 tag
export const groupFilter = (state = 'SHOW_ALL', action) => {
  // console.log('in reducer groupFilter');
  switch (action.type) {
    case 'SET_GROUP_FILTER':
      console.log('in reducers groupfilter set filter', action.tags);
      return action.tags;
    default:
      return state;
  }
};

// // some flagged posts related info to notify users
// // notify poster that this post is deleted
// export const notifyPosterOnDelete = (state = [], action) => {
//   // console.log('in reducer notifyPosterOnDelete');
//   switch (action.type) {
//     case 'DELETE_FLAG':// add here, so poster can be notified
//       return [
//         ...state,
//         {
//           post: action.post,
//           poster: action.poster,
//         },
//       ];
//     case 'NOTIFY_DELETE_DONE': // finished notifying poster of a deleted flagged post
//       return state.filter((notif) => ((notif.poster !== action.poster)));
//     default:
//       return state;
//   }
// };
// // notify flagger that this post is deleted
// export const notifyFlaggerOnDelete = (state = [], action) => {
//   // console.log('in reducer notifyFlaggerOnDelete');
//   switch (action.type) {
//     case 'DELETE_FLAG':// add here, so flagger can be notified
//       return [
//         ...state,
//         {
//           post: action.post,
//           flagger: action.flagger,
//         },
//       ];
//     case 'NOTIFY_DELETE_DONE': // finished notifying flagger of a deleted flagged post
//       return state.filter((notif) => ((notif.flagger !== action.flagger)));
//     default:
//       return state;
//   }
// };
// // notify flagger that this post is unflagged
// export const notifyFlaggerOnUnflag = (state = [], action) => {
//   // console.log('in reducer notifyFlaggerOnUnflag');
//   switch (action.type) {
//     case 'UNFLAG':// add here, so flagger can be notified
//       return [
//         ...state,
//         {
//           post: action.post,
//           flagger: action.flagger,
//         },
//       ];
//     case 'NOTIFY_UNFLAG_DONE': // finished notifying flagger of a unflagged flagged post
//       return state.filter((notif) => ((notif.flagger !== action.flagger)));
//     default:
//       return state;
//   }
// };

// notify user that their request is approved
export const notifyRequestApproved = (state = [], action) => {
  console.log('in reducer notifyRequestApproved');
  switch (action.type) {
    case 'APPROVE_REQUEST':// add here, so user can be notified
      return [
        ...state,
        {
          user: action.user,
          group: action.group,
        },
      ];
    case 'NOTIFY_REQUEST_APPROVED': // finished notifying user request approved
      return state.filter((notif) => ((notif.user !== action.user)));
    default:
      return state;
  }
};

// notify user that their request is denied
export const notifyRequestDenied = (state = [], action) => {
  console.log('in reducer notifyRequestDenied');
  switch (action.type) {
    case 'DENY_REQUEST':// add here, so user can be notified
      return [
        ...state,
        {
          user: action.user,
          group: action.group,
        },
      ];
    case 'NOTIFY_REQUEST_DENIED': // finished notifying user request denied
      return state.filter((notif) => ((notif.user !== action.user)));
    default:
      return state;
  }
};
export const socket = (state = null, action) => {
  console.log('in reducer connect to socket');
  switch (action.type) {
    case 'SOCKET_CONNECT':
      console.log(`in reducers connect to socket. socket is ${action.socket.connected}`);
      return action.socket;
    case 'SOCKET_DISCONNECT':
      console.log(`in reducers disconnect to socket. socket is ${action.socket}`);
      return null;
    default:
      return state;
  }
};
// export const rootReducer = combineReducers({
//   activeUser, groupFilter, groups, socket,
// });
export const rootReducer = combineReducers({
  groupFilter, groups, socket,
});
