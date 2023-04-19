/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  Layout, Form, Input, Button, notification, Checkbox, Upload,
} from 'antd';
import {
  LoadingOutlined, PlusOutlined, EyeInvisibleOutlined, EyeTwoTone, SmileTwoTone,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import userLib from './userAPI';
import DefaultUserAvatar from '../defaultAvatar.jpeg';
import './EditProfilePopup.css';

const { Content } = Layout;
const layout = {
  labelCol: { span: 8, offset: 4 },
  wrapperCol: { span: 16, offset: 4 },
};

function EditProfilePopup(props) {
  const { activeUser } = props;
  const [userAvatar, setUserAvatar] = useState();
  const [picFile, setPicFile] = useState();

  const cleanup = () => {
    // clear input file name
    const fileBox = document.getElementById('input');
    fileBox.value = '';
    setUserAvatar();
    setPicFile();
  };

  const onSubmit = (values) => {
    console.log('in onFinish eidt user profile');
    const { newpassword, deactivate } = values;
    if (!newpassword && !userAvatar && !deactivate) {
      alert('Nothing to change!');
      return;
    }
    // let allSucceed = true;
    const newUserInfo = {
      username: activeUser.username,
    };
    if (deactivate) {
      console.log('deactivate account is checked!');
      // remove everything related to this user in db
      userLib.deleteUserAndRelated(activeUser._id);
    }
    let update;
    if (newpassword) {
      newUserInfo.password = newpassword;
      update = true;
    }
    if (userAvatar) {
      newUserInfo.profile_image = userAvatar;
      update = true;
    }
    if (update) {
      console.log('Need to update user. newUserInfo is', newUserInfo);
      userLib.updateUserByAttrib(activeUser._id, newUserInfo).then((user) => {
        if (user) {
          console.log('updateUser succeeded');
          if (userAvatar) {
            props.changeAvatar(userAvatar);
          }
          notification.open({
            message: 'Update Profile Succeeded!',
            icon: <SmileTwoTone />,
            duration: 2,
            closeIcon: (<div />), // hide the close btn
          });
        }
      }).catch((error) => {
        console.log('updateUser failed');
        notification.open({
          message: 'Update Profile Failed!',
          type: 'error',
          duration: 2,
          closeIcon: (<div />), // hide the close btn
        });
      });
    }
    cleanup();
    props.setTrigger(false);
  };

  const handleFileChange = (e) => {
    // console.log('file change');
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        // console.log(reader.result);
        setUserAvatar(reader.result);// actual data url
      }
    };
    const file = e.target.files[0]; // file with name, size, etc
    reader.readAsDataURL(file);
    // console.log(file);
    setPicFile(file);
    // check size
    const isLt4M = file.size / 1024 / 1024 < 4;
    if (!isLt4M) {
      notification.open({
        message: 'Image must be smaller than 4MB!',
        type: 'warning',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
      cleanup();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Edit Profile Failed:', errorInfo);
  };

  return (props.trigger) ? (
    <div className="popup">
      <div className="popup-inner">
        <Content>
          <div>
            <div>
              <h3>Edit Profile</h3>
            </div>
            <Form
              {...layout}
              name="basic"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
              onFinishFailed={onFinishFailed}
            >

              <Form.Item
                label="Reset Password"
                name="newpassword"
                rules={[
                  { required: false, message: 'Please input your new password!' },
                  {
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message: 'Password must contain at least 6 characters, with at least 1 letter and 1 digit',
                  },
                ]}
              >
                <Input.Password
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <div className="img-holder">
                {userAvatar ? (
                  <img src={userAvatar} alt="" id="img" />
                ) : (
                  <img src={DefaultUserAvatar} alt="" id="img" />
                )}
              </div>
              <input className="image-label" type="file" accept="image/*" name="image-upload" id="input" onChange={handleFileChange} />

              <Form.Item name="deactivate" valuePropName="checked" noStyle>
                <Checkbox>Deactivate Account</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                {' '}
                <Button type="primary" htmlType="submit" onClick={() => props.setTrigger(false)}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </div>
    </div>
  ) : '';
}

export default EditProfilePopup;
