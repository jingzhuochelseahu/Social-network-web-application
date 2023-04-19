/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import {
  notification, Menu, Layout,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { logOutActiveUser } from '../actions';
import SearchBar from './SearchBar';
import Notification from './notification.svg';
import Message from './message.svg';
import userLib from './user/userAPI';
import './Home.css';

function NavBar(props) {
  const { currentUser, store } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const activeUser = useSelector((state) => state.activeUser);
  // const [activeUser, setActiveUser] = useState();

  const socket = useSelector((state) => state.socket);
  // const logout = () => {
  //   window.location.href = 'http://localhost:3000/';
  // };
  const [adminNotif, setAdminNotif] = useState([]);
  const [openAdminNotif, setOpenAdminNotif] = useState(false);

  const [messageNotif, setMessageNotif] = useState([]);
  const [openMessageNotif, setOpenMessageNotif] = useState(false);

  const [flagPostNotif, setFlagPostNotif] = useState([]);
  const [openFlagPostNotif, setOpenFlagPostNotif] = useState(false);

  const [unflaggedPostNotif, setUnflaggedPostNotif] = useState([]);
  const [openUnflaggedPostNotif, setOpenUnflaggedPostNotif] = useState(false);

  // for posts you made
  const [deletePostNotif, setDeletePostNotif] = useState([]);
  const [openDeletePostNotif, setOpenDeletePostNotif] = useState(false);

  // for posts you flagged
  const [deleteFlaggedPostNotif, setDeleteFlaggedPostNotif] = useState([]);
  const [openDeleteFlaggedPostNotif, setOpenDeleteFlaggedPostNotif] = useState(false);

  const [makeNewPostNotif, setMakeNewPostNotif] = useState([]);
  const [openMakeNewPostNotif, setOpenMakeNewPostNotif] = useState(false);

  const [mentionUserNotif, setMentionUserNotif] = useState([]);
  const [openMentionUserNotif, setOpenMentionUserNotif] = useState(false);

  // accepted  and rejected request
  const [acceptRequestNotif, setAcceptRequestNotif] = useState([]);
  const [openAcceptRequestNotif, setOpenAcceptRequestNotif] = useState(false);

  const [rejectRequestNotif, setRejectRequestNotif] = useState([]);
  const [openRejectRequestNotif, setOpenRejectRequestNotif] = useState(false);

  // no need to fetch activeUser for NavBar because username is the only thing we want and it stays the same,
  // but if we want to add profile_image, we need to fetch again
  // useEffect(async () => {
  //   console.log('in NavBar, currentUser from props is', user);
  //   if (user) {
  //     // we need to fetch for new info regarding this user!
  //     await (userLib.getUserById(user._id)).then((res) => {
  //       console.log('activeUser is now', res);
  //       setActiveUser(res);
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    socket?.on('getAddAdminNotification', (data) => {
      setAdminNotif((prev) => [...prev, data]);
    });

    socket?.on('getFlagPostsNotification', (data) => {
      setFlagPostNotif((prev) => [...prev, data]);
    });

    socket?.on('getUnflagPostsNotification', (data) => {
      setUnflaggedPostNotif((prev) => [...prev, data]);
    });

    // for posts you made
    socket?.on('getDeletePostNotification', (data) => {
      setDeletePostNotif((prev) => [...prev, data]);
    });
    // for posts you flagged
    socket?.on('getDeleteFlaggedPostNotification', (data) => {
      console.log('data');
      setDeleteFlaggedPostNotif((prev) => [...prev, data]);
    });

    socket?.on('GetMessageNotification', (data) => {
      setMessageNotif((prev) => [...prev, data]);
    });

    socket?.on('GetPostNotification', (data) => {
      setMakeNewPostNotif((prev) => [...prev, data]);
    });

    socket?.on('GetMentionUserNotification', (data) => {
      setMentionUserNotif((prev) => [...prev, data]);
    });

    socket?.on('GetAcceptRequestNotification', (data) => {
      setAcceptRequestNotif((prev) => [...prev, data]);
    });

    socket?.on('GetRejectRequestNotification', (data) => {
      setRejectRequestNotif((prev) => [...prev, data]);
    });
  }, [socket]);

  const displayAdminNotif = ({ senderName, group }) => (
    <span className="notification">{`${senderName} added you as the administrator of ${group}`}</span>
  );

  const displayFlagPostNotif = ({ senderName, group }) => (
    <span className="notification">{`${senderName} flagged a post in ${group}`}</span>
  );

  const displayUnflaggedPostNotif = ({ groupName }) => (
    <span className="notification">{`An administrator unflagged a post in ${groupName}`}</span>
  );

  const displayDeleteFlaggedPostNotifToFlagger = ({ groupName }) => (
    <span className="notification">{`An administrator deleted a post you flagged in ${groupName}`}</span>
  );

  const displayDeleteFlaggedPostNotifToPoster = ({ groupName }) => (
    <span className="notification">{`An administrator deleted a flagged post you had in ${groupName}`}</span>
  );

  const displayMessageNotif = ({ senderName, group }) => (
    <span className="notification">{`${senderName} sended you a message in ${group} chat page`}</span>
  );

  const displayNewPostNotif = ({ senderName, group }) => (
    <span className="notification">{`${senderName} made a new post in ${group}`}</span>
  );

  const displayMentionUserNotif = ({ group }) => (
    <span className="notification">
      <p>{`A new post in ${group}`}</p>
      <p>{`You are mentioned in ${group}`}</p>
    </span>
  );

  const displayAcceptRequestNotif = ({ group }) => (
    <span className="notification">
      <p>{`Your request to join ${group} has been accepted`}</p>
    </span>
  );

  const displayRejectRequestNotif = ({ group }) => (
    <span className="notification">
      <p>{`Your request to join ${group} has been rejected`}</p>
    </span>
  );

  const handleMarkAsReadAdminNotif = () => {
    setOpenAdminNotif(!openAdminNotif);
    setAdminNotif([]);
  };

  const handleMarkAsReadFlagPostNotif = () => {
    setOpenFlagPostNotif(!openFlagPostNotif);
    setFlagPostNotif([]);
  };

  const handleMarkAsReadUnflaggedPostNotif = () => {
    setOpenUnflaggedPostNotif(!openUnflaggedPostNotif);
    setUnflaggedPostNotif([]);
  };

  const handleMarkAsReadDeleteFlaggedPostNotifToPoster = () => {
    setOpenDeletePostNotif(!openDeletePostNotif);
    setDeletePostNotif([]);
  };

  const handleMarkAsReadDeleteFlaggedPostNotifToFlagger = () => {
    setOpenDeleteFlaggedPostNotif(!openDeleteFlaggedPostNotif);
    setDeleteFlaggedPostNotif([]);
  };

  const handleMarkAsReadMessageNotif = () => {
    setOpenMessageNotif(!openMessageNotif);
    setMessageNotif([]);
  };

  const handleMarkAsReadMakeNewPostNotif = () => {
    setOpenMakeNewPostNotif(!openMakeNewPostNotif);
    setMakeNewPostNotif([]);
  };

  const handleMarkAsReadMentionUserNotif = () => {
    setOpenMentionUserNotif(!openMentionUserNotif);
    setMentionUserNotif([]);
    setMakeNewPostNotif([]);
  };

  const handleMarkAsReadAcceptRequestNotif = () => {
    setOpenAcceptRequestNotif(!openAcceptRequestNotif);
    setAcceptRequestNotif([]);
  };

  const handleMarkAsReadRejectRequestNotif = () => {
    setOpenRejectRequestNotif(!openRejectRequestNotif);
    setRejectRequestNotif([]);
  };

  return (
    <div className="Navigation-Bar">
      {/* TODO: change icon src */}
      <img className="App-Icon" src="../favicon.ico" alt="icon" />
      <Link
        to="/"
      // onClick={(e) => {
      //   changePage('home');
      // }}
      >
        Home
      </Link>
      <Link
        to="/sortgroups"
      // onClick={(e) => {
      //   changePage('sortgroups');
      // }}
      >
        Sort Groups
      </Link>
      {currentUser ? (
        <Link
          // to={`/profile/${activeUser._id}`}
          to="/profile"
        // onClick={(e) => {
        //   changePage('profile');
        // }}
        >
          Profile
        </Link>
      ) : null}
      <SearchBar
        store={store}
      />
      {currentUser ? (
        <div className="userNav">
          <div className="usernamePart">
            <p>
              Hello,
              {' '}
              <b>{currentUser.username}</b>
              {' '}
              {' '}
              <Link
                to="/logout"
              >
                Logout
              </Link>
            </p>
          </div>
          {adminNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenAdminNotif(!openAdminNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openAdminNotif ? (
                <div className="notifications">
                  {adminNotif.map((n) => (displayAdminNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadAdminNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {flagPostNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenFlagPostNotif(!openFlagPostNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openFlagPostNotif ? (
                <div className="notifications">
                  {flagPostNotif.map((n) => (displayFlagPostNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadFlagPostNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {unflaggedPostNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenUnflaggedPostNotif(!openUnflaggedPostNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openUnflaggedPostNotif ? (
                <div className="notifications">
                  {unflaggedPostNotif.map((n) => (displayUnflaggedPostNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadUnflaggedPostNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {/* notif for deleting a post you flagged */}
          {deleteFlaggedPostNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenDeleteFlaggedPostNotif(!openDeleteFlaggedPostNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openDeleteFlaggedPostNotif ? (
                <div className="notifications">
                  {deleteFlaggedPostNotif.map((n) => (displayDeleteFlaggedPostNotifToFlagger(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadDeleteFlaggedPostNotifToFlagger()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {/* notif for deleting a post you made */}
          {deletePostNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenDeletePostNotif(!openDeletePostNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openDeletePostNotif ? (
                <div className="notifications">
                  {deletePostNotif.map((n) => (displayDeleteFlaggedPostNotifToPoster(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadDeleteFlaggedPostNotifToPoster()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {messageNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenMessageNotif(!openMessageNotif)}>
                <img src={Message} className="iconImg" alt="" />
              </div>
              {openMessageNotif ? (
                <div className="notifications">
                  {messageNotif.map((n) => (displayMessageNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadMessageNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {makeNewPostNotif.length !== 0 && mentionUserNotif.length === 0 ? (
            <>
              <div className="icon" onClick={() => setOpenMakeNewPostNotif(!openMakeNewPostNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openMakeNewPostNotif ? (
                <div className="notifications">
                  {makeNewPostNotif.map((n) => (displayNewPostNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadMakeNewPostNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {mentionUserNotif.length !== 0 && makeNewPostNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenMentionUserNotif(!openMentionUserNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openMentionUserNotif ? (
                <div className="notifications">
                  {mentionUserNotif.map((n) => (displayMentionUserNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadMentionUserNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {acceptRequestNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenAcceptRequestNotif(!openAcceptRequestNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openAcceptRequestNotif ? (
                <div className="notifications">
                  {acceptRequestNotif.map((n) => (displayAcceptRequestNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadAcceptRequestNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
          {rejectRequestNotif.length !== 0 ? (
            <>
              <div className="icon" onClick={() => setOpenRejectRequestNotif(!openRejectRequestNotif)}>
                <img src={Notification} className="iconImg" alt="" />
              </div>
              {openRejectRequestNotif ? (
                <div className="notifications">
                  {rejectRequestNotif.map((n) => (displayRejectRequestNotif(n)))}
                  <button type="button" className="markedAsRead" onClick={() => handleMarkAsReadRejectRequestNotif()}>Read</button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : (
        <Link
          to="/login"
        // onClick={(e) => {
        //   changePage('login');
        // }}
        >
          Login to explore more!
        </Link>
      )}
    </div>
  );
}

export default NavBar;
