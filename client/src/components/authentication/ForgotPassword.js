/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  Layout, Form, Input, Button, notification,
} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Login.css';
import authHelper from './authAPI';
import userLib from '../user/userAPI';

const { Content } = Layout;
const layout = {
  labelCol: { span: 8, offset: 4 },
  wrapperCol: { span: 16, offset: 4 },
};

function ForgotPassword(props) {
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    console.log('in onFinish forgot password');
    const { email, username, newpassword } = values;
    // first check if email and username match
    await userLib.getUserByName(username).then(async (res) => {
      if (res !== '') {
        if (res.email !== email) {
          notification.open({
            message: 'Wrong username and email combination!',
            type: 'error',
            duration: 2,
            closeIcon: (<div />), // hide the close btn
          });
        } else {
          const newUser = {
            password: newpassword,
          };
          await userLib.updateUserByAttrib(res._id, newUser).then((user) => {
            if (user) {
              notification.open({
                message: 'Reset Password Succeeded!',
                icon: <SmileTwoTone />,
                duration: 2,
                closeIcon: (<div />), // hide the close btn
              });
              navigate('/login');
            }
          });
        }
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Reset password Failed:', errorInfo);
  };

  return (
    <Content>
      <div className="container">
        <div className="loginHeader">
          <h3>Reset Password</h3>
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              {
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/,
                message: 'Must be a valid email!',
              },
            ]}
          >
            <Input
              size="large"
            />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username cannot be less than 3 characters!' },
            ]}
          >
            <Input
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newpassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
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

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Reset Password
            </Button>
          </Form.Item>

          <Form.Item>
            <Link to="/registration">Do not have an account yet?</Link>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default ForgotPassword;
