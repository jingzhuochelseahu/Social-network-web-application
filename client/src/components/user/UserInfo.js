// used in Profile page, show username, registration date, avatar and option to edit
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Layout, Form, Input, Button, notification, Checkbox,
} from 'antd';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { EyeInvisibleOutlined, EyeTwoTone, SmileTwoTone } from '@ant-design/icons';
import Popup from 'reactjs-popup';
import { Link, useNavigate } from 'react-router-dom';
import EditProfilePopup from './EditProfilePopup';
import DefaultUserAvatar from '../defaultAvatar.jpeg';
import './UserInfo.css';

const { Content } = Layout;
const layout = {
  labelCol: { span: 8, offset: 4 },
  wrapperCol: { span: 16, offset: 4 },
};

function UserInfo(props) {
  const { user } = props;
  const [avatar, setAvatar] = useState(DefaultUserAvatar);
  const [showEditPopUp, setShowEditPopUp] = useState(false);

  useEffect(() => {
    if (user && user.profile_image) {
      setAvatar(user.profile_image);
    }
  }, []);

  const handleClickEdit = () => {
    console.log('here');
    setShowEditPopUp(true);
  };

  return (
    <div>
      {user ? (
        <div className="userInfoContainer">
          User Info
          <div className="UserInfo">
            <p>
              Username:
              {' '}
              {user.username}
            </p>
            <p>
              Registration Date:
              {' '}
              {new Date(user.registration_date).toDateString()}
            </p>
            <img className="UserAvatar" src={avatar} alt="User Avatar" width="80" height="80" />
            <button type="button" className="EditProfileButton" onClick={handleClickEdit}>Edit Profile Info</button>
            <EditProfilePopup activeUser={user} trigger={showEditPopUp} changeAvatar={setAvatar} setTrigger={setShowEditPopUp}>
              <h3>My POPUP</h3>
            </EditProfilePopup>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default UserInfo;
