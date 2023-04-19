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
import { io } from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import './Login.css';
import authHelper from './authAPI';
import { socketConnection } from '../../actions';

require('dotenv').config();

const { Content } = Layout;
const layout = {
  labelCol: { span: 8, offset: 4 },
  wrapperCol: { span: 16, offset: 4 },
};
const jwt = require('jsonwebtoken');

function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [socketConnect, setSocketConnect] = useState(null);
  // TODO, not woking here
  // const { JWT_KEY } = process.env;
  const JWT_KEY = 'SomeRandomKeyyy';
  // console.log('testing!!!! mongodb is', process.env.MONGODB_USER);
  // console.log('JWT_KEY is', JWT_KEY);

  const onSubmit = (values) => {
    console.log('in onFinish Login');
    const { username, password } = values;
    authHelper.logIn(username, password).then((user) => {
      if (user) {
        console.log('Login success, going to dispatch');
        // add jsonwebtoken and store it as currenUser in localstorage
        const token = jwt.sign(
          { id: user._id },
          JWT_KEY,
          {
            expiresIn: 3600, // 1 hour
          },
        );
        console.log('token is', token);
        const decodedToken = jwtDecode(token);
        console.log('decoded token is', decodedToken);
        const newUser = {
          // only include the ones that cannot be changed!
          token,
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
        };
        console.log('going to set newUser in localstorage', newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        // lift user state up
        props.onSuccess(newUser);

        // connect to socket
        // console.log('%%%%%%%%%%%%%%%%%%%%%%% socket is', socketConnect);
        dispatch(socketConnection(socketConnect));
        console.log('finished dispatch');
        notification.open({
          message: 'Login Succeeded!',
          icon: <SmileTwoTone />,
          duration: 2,
          closeIcon: (<div />), // hide the close btn
        });
        // TODO, how to navigate on condition?
        navigate('/'); // go back to hsome page
      }
    });
  };

  useEffect(() => {
    // use this if you are running on localhost
    // const socket = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] }); // now socket and express servers are both listening to port 5000
    // use this if deployed to heroku
    const socket = io('https://cis557-team19-finalproject.herokuapp.com', { transports: ['websocket', 'polling', 'flashsocket'] });
    setSocketConnect(socket);
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log('Login Failed:', errorInfo);
  };

  return (
    <Content>
      <div className="container">
        <div className="loginHeader">
          <h3>Login</h3>
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
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
            ]}
          >
            <Input
              name="test"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
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
              Login
            </Button>
          </Form.Item>

          <Form.Item>

            <a className="login-form-forgot" href="/forgotpassword">
              Forgot Password
            </a>
          </Form.Item>

          <Form.Item>
            <Link to="/registration">Do not have an account yet?</Link>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default Login;
