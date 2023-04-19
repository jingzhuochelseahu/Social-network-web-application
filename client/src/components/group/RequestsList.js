/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */

import { CloseOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import {
  Layout, Form, Input, Button, notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import RequestItem from './RequestAvatarText'; // TODO, remove it, not used
import requestLib from './requestAPI';
import userGroupLib from './userGroupAPI';
import userLib from '../user/userAPI';
import groupLib from './groupAPI';

function RequestsList(props) {
  const { pendingRequests, groupId } = props;
  const socket = useSelector((state) => state.socket);
  const [currGroup, setCurrGroup] = useState();
  // console.log('in FlaggedPostList, posts are ', requests);
  console.log(`requests1 are ${pendingRequests.data}`);
  useEffect(async () => {
    // get current group info
    await groupLib.getGroupById(groupId).then(async (g) => {
      console.log('Curr group is ', g);
      setCurrGroup(g);
    });
  }, []);
  const acceptRequest = async (e, request) => {
    const user = userLib.getUserById(request.userId);
    console.log(`request id is ${request.userId}`);
    console.log(`currGroup is ${currGroup}`);
    if (user.public_group) {
      user.public_groups.push(request.groupId);
    } else {
      user.public_groups = [request.groupId];
    }
    await userLib.updateUserByAttrib(request.userId, user);
    if (currGroup.members) {
      currGroup.members.push(request.userId);
      console.log(`successfully pushed and members are ${currGroup.members}`);
      console.log(currGroup);
    } else {
      console.log('currGroup members not exist');
    }
    const newGroup = {
      members: currGroup.members,
    };
    await groupLib.updateGroup(request.groupId, newGroup);
    console.log('pushed new public group');
    await requestLib.deleteRequest(request._id);
    socket?.emit('SendAcceptRequest', {
      receiverId: request.userId,
      group: currGroup.name,
    });
    // hide the request
    // console.log('parent is ', e.target.parentNode);
    const parent = e.target.parentNode;
    parent.style.display = 'none';
    notification.open({
      message: 'Accepted a request!',
      type: 'success',
      duration: 1,
      closeIcon: (<div />), // hide the close btn
    });
  };
  const rejectRequest = async (e, request) => {
    requestLib.deleteRequest(request._id);
    socket?.emit('SendRejectRequest', {
      receiverId: request.userId,
      group: currGroup.name,
    });
    // hide the request
    // console.log('parent is ', e.target.parentNode);
    const parent = e.target.parentNode;
    parent.style.display = 'none';
    notification.open({
      message: 'Rejected a request!',
      type: 'success',
      duration: 1,
      closeIcon: (<div />), // hide the close btn
    });
  };
  return (
    <div>
      {pendingRequests.data.length > 0 ? (
        pendingRequests.data.map((request) => (
          <div>
            <tr key={request._id}>
              <td>{request.username}</td>
              <button type="button" onClick={(e) => acceptRequest(e, request)}>Accept</button>
              <button type="button" onClick={(e) => rejectRequest(e, request)}>Reject</button>
            </tr>
          </div>
        ))
      ) : <p>No Pending Requests</p>}
    </div>
  );
}
export default RequestsList;
