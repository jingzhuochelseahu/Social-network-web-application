/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Layout, Form, Input, Button, notification,
} from 'antd';
import {
  EyeInvisibleOutlined, EyeTwoTone, SmileTwoTone,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import './Login.css';
import authHelper from './authAPI';

const { Content } = Layout;
const layout = {
  labelCol: { span: 8, offset: 4 },
  wrapperCol: { span: 16, offset: 4 },
};

function SignUp() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('in signup onfinish');
    const {
      email, fullname, username, password,
    } = values;
    await authHelper.signUp(email, password, fullname, username).then((user) => {
      if (user) {
        console.log('Signup success');
        console.log('user is ', user);
        notification.open({
          message: 'Registration Succeeded!',
          // icon: <SmileTwoTone />,
          type: 'success',
          duration: 2,
          closeIcon: (<div />), // hide the close btn
        });
        navigate('/login'); // redirect to log in page
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Signup Failed:', errorInfo);
  };

  return (
    <Content>
      <div className="container">
        <div className="signUpHeader">
          <h3>SignUp</h3>
        </div>
        <Form
          {...layout}
          name="registration-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              {
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/,
                message: 'Must be a valid email!',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[
              { required: true, message: 'Please enter your full name!' },
              {
                pattern: /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z\-0-9]{1,})?)$/,
                message: 'Full name should have first name, space and last name',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="username"
            rules={[
              { required: true, message: 'Please enter your user name used for display!' },
              { min: 3, message: 'Username cannot be less than 3 characters!' },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password!' },
              // at least 6 chars, 1 letter and 1 number:
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: 'Password must contain at least 6 characters, with at least 1 letter and 1 digit',
              },
            ]}
          >
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmpassword"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>

          <Form.Item>
            <Link to="/login">Already have an account?</Link>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default SignUp;
