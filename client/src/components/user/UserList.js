/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserNameAvatar.css';
import lib from './userAPI';
import UserNameAvatar from './UserNameAvatar';

function UserList(props) {
  const { users } = props;
  console.log('in UserList, users are ', users);

  return (
    <div>
      {users ? (
        <div className="userInfo">
          <div className="adminListMember">
            {/* {users.map((user) => <div className="userName">{user}</div>)} */}
            {users.map((userId) => <UserNameAvatar key={userId} userId={userId} />)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default UserList;
