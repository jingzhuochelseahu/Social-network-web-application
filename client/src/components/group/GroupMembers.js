// contains UserList of group members and the number of members in a group
import React, { useState } from 'react';
import './GroupMembers.css';
import UserList from '../user/UserList';

function GroupMembers(props) {
  const { currentGroup } = props;
  return (
    <div className="groupList">
      <div className="groupListMember">
        <div>
          {/* <div className="groupName" /> */}
          <UserList users={currentGroup.members} />
          <div className="groupMember">
            {currentGroup.members.length}
            {' '}
            members
          </div>
        </div>
      </div>
    </div>
  );
}
export default GroupMembers;
