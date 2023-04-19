/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */

import lib, { SmileTwoTone } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import userLib from './userAPI';
import groupLib from '../group/groupAPI';
import invitesLib from '../group/invitesAPI';
import requestLib from '../group/requestAPI';
import './ProfileOwn.css';

function InvitesList(props) {
  const { pendingInvites } = props;
  // console.log('in FlaggedPostList, posts are ', requests);
  console.log(`Invites are ${JSON.stringify(pendingInvites.data)}`);

  const acceptInvite = async (invite) => {
    const currUser = await userLib.getUserById(invite.invitedId);
    console.log(`current user is ${currUser}`);
    await requestLib.createRequest(invite.invitedId, invite.groupId, currUser.username).then((res) => {
      console.log('sent Request', res);
    });
    console.log(`invited id is ${invite._id}`);
    await invitesLib.deleteInvite(invite._id);
    notification.open({
      message: 'Accepted Group Invite. Waiting for the administrator to accept your request.',
      icon: <SmileTwoTone />,
      duration: 2,
      closeIcon: (<div />), // hide the close btn
    });
  };
  const rejectInvite = async (invite) => {
    invitesLib.deleteInvite(invite._id);
  };
  return (
    <div>
      {pendingInvites.data.length > 0 ? (
        pendingInvites.data.map((invite) => (
          <div className="InviteBox">
            <tr key={invite._id}>
              <td>{invite.groupname}</td>
              <button type="button" onClick={() => acceptInvite(invite)}>Accept</button>
              <button type="button" onClick={() => rejectInvite(invite)}>Reject</button>
            </tr>
          </div>
        ))
      ) : <p>No Pending Invites</p>}
    </div>
  );
}
export default InvitesList;
