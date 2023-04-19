// display group name, type and avatar
import React, { useState } from 'react';
import './GroupNameAvatar.css';

function GroupNameAvatar(props) {
  const { currentGroup } = props;
  const defaultPic = 'https://facepic.qidian.com/qd_face/349573/a430412837/0';
  const picPath = currentGroup.profile_image ? currentGroup.profile_image : defaultPic;

  return (
    <div className="groupNameAvatar">
      <div className="currentGroup">
        <div className="currentGroupTitle">{currentGroup.name}</div>
        <div className="group">
          <img alt="group" src={picPath} />
        </div>
        {currentGroup.public ? (
          <div className="groupStatus"> Public </div>
        ) : (
          <div className="groupStatus"> Private </div>
        )}
      </div>
    </div>
  );
}

export default GroupNameAvatar;
