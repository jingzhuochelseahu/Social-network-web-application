/* eslint-disable import/no-named-as-default-member */
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import { notification } from 'antd';
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { rootReducer } from './reducers/index';
import { setActiveUser } from './actions/index';
import SignUp from './components/authentication/SignUp';
import Login from './components/authentication/Login';
import Logout from './components/authentication/Logout';
import ProfileOwn from './components/user/ProfileOwn';
import CreateGroup from './components/group/CreateGroup';
import Home from './components/Home';
import GroupBoard from './components/group/GroupBoard';
import MakePost from './components/post/MakePost';
import NavBar from './components/Navbar';
import ForgotPassword from './components/authentication/ForgotPassword';
import FilterGroup from './components/group/FilterGroup';
import SortGroups from './components/group/SortGroups';
import Chat from './components/chat/Chat';
import authLib from './components/authentication/authAPI';
import './App.css';

function App({ store }) {
  // const user = useSelector((state) => state.activeUser);
  // const groupFilter = useSelector((state) => state.groupFilter);
  // TODO add another component to wrap for user check
  const [user, setUser] = useState(authLib.getCurrentUserFromStorage());
  // const [page, setPage] = useState('home');
  console.log('In app, user is', user);

  const logout = () => {
    authLib.logout();
    setUser(null);
    notification.open({
      message: 'You have logged out!',
      type: 'success',
      duration: 1,
      closeIcon: (<div />), // hide the close btn
    });
  };

  return (
    <Router>
      <div className="App">
        <NavBar currentUser={user} store={store} />
        <Routes>
          <Route exact path="/" element={<Home currentUser={user} />} />
          <Route exact path="/filtergroup" store={store} element={<FilterGroup />} />
          <Route exact path="/registration" element={<SignUp />} />
          <Route exact path="/login" element={<Login onSuccess={setUser} />} />
          <Route exact path="/logout" element={<Logout onMount={logout} />} />
          <Route exact path="/profile" element={<ProfileOwn currentUser={user} />} />
          <Route exact path="/createGroup/:userid" element={<CreateGroup />} />
          <Route path="/groupboard/:groupid" element={<GroupBoard currentUser={user} />} />
          <Route exact path="/makepost" element={<MakePost currentUser={user} />} />
          <Route exact path="/forgotpassword" element={<ForgotPassword />} />
          <Route exact path="/sortgroups" element={<SortGroups />} />
          <Route exact path="/groupboard/:groupid/chat/:userid" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
