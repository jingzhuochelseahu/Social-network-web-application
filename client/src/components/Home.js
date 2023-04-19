/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import userLib from './user/userAPI';
import groupLib from './group/groupAPI';
import './Home.css';
import CreateJoinGroup from './user/CreateJoinGroup';

function Home(props) {
  const { currentUser } = props;
  const [allGroups, setAllGroups] = useState([]);
  const [pubGroups, setPubGroups] = useState([]);
  const [privGroups, setPrivGroups] = useState([]);
  const [suggestPubGroups, setSuggestPubGroups] = useState([]);

  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState();
  // get the socket connection
  const socket = useSelector((state) => state.socket);
  console.log('&&&&&&&&&&&&& sockets is', socket);

  // fetch activeUser info from db, need to do this since user data might change, eg. groups they are in
  useEffect(async () => {
    console.log('in Home, currentUser from props is ', currentUser);
    if (currentUser) {
      console.log('in Home, currentUser id is ', currentUser._id);
      // we need to fetch for new info regarding this user!
      await (userLib.getUserById(currentUser._id)).then((res) => {
        console.log('activeUser is now', res);
        setActiveUser(res);
      });
    }
  }, []);

  // add the current user to the socket
  useEffect(() => {
    if (currentUser) {
      console.log('currentUser is', currentUser);
      socket?.emit('newUser', currentUser._id);
    }
  }, [socket]);

  const handleClickGroup = (e) => {
    // console.log('parent is ', e.target.parentNode);
    const { id } = e.target.parentNode;
    navigate(`/groupboard/${id}`);
  };

  useEffect(async () => {
    // get data from server, add to global or local state? Maybe global later since there are groups that we need to hide?
    if (currentUser) {
      await groupLib.getGroups().then((groups) => {
        // setAllGroups(groups);
        // only top N public groups are shown
        const N = 10;
        const pub = groups.filter((g) => g.public === 1 && g.members.includes(currentUser._id)).slice(0, N);
        const priv = groups.filter((g) => g.public === 0 && g.members.includes(currentUser._id)).slice(0, N);
        const suggestPub = groups.filter((g) => g.public === 1 && !g.members.includes(currentUser._id)).slice(0, 10);
        setPubGroups(pub);
        setPrivGroups(priv);
        setSuggestPubGroups(suggestPub);
      });
    }
  }, []);

  return (
    <div className="container">
      <div className="Content">

        {!activeUser ? (
          <div className="LogoutMessage">
            <p>Login to explore more!</p>
          </div>
        ) : null}
        {activeUser ? (
          <div className="Group-exhibition">

            {/* ONLY SHOW N GROUPS */}
            <div className="Public-Group">
              {pubGroups.length ? (
                <div className="Groups">
                  {activeUser ? (
                    <p>Public Groups </p>
                  ) : (
                    <p>Groups you might be interested in</p>
                  )}
                  <ul>
                    {pubGroups.map((g) => (
                      <li key={g._id} id={g._id}>
                        <img src={g.profile_image} className="GroupProfileImg" alt="" />
                        {g.name}
                        <button type="button" className="VisitButton" onClick={handleClickGroup}>Visit</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>You have no public groups yet</p>
              )}
            </div>
            <div className="Private-Group">
              {activeUser ? (
                <div>
                  {privGroups.length ? (
                    <div className="Groups">
                      {/* TODO: FIX CSS LATER */}
                      <p>Private Groups</p>
                      <ul>
                        {privGroups.map((g) => (
                          g.members.includes(activeUser._id) ? (
                            <li key={g._id} id={g._id}>
                              <img src={g.profile_image} className="GroupProfileImg" alt="" />
                              {g.name}
                              <button type="button" className="VisitButton" onClick={handleClickGroup}>Visit</button>
                            </li>
                          ) : null
                        ))}
                      </ul>
                    </div>
                  ) : 'You have no private groups yet'}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeUser && suggestPubGroups.length ? (
          <div className="SuggestedGroup-exhibition">
            <div className="Groups">
              <p>Groups you might be interested in</p>
              <div className="SuggestedPublic-Group">
                <ul>
                  {suggestPubGroups.map((group) => (
                    <li key={group._id} id={group._id}>
                      <img src={group.profile_image} className="GroupProfileImg" alt="" />
                      {group.name}
                      <button type="button" className="VisitButton" onClick={handleClickGroup}>Visit</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {/* {activeUser ? (
          <div className="Group-exhibition">
            <CreateJoinGroup currentUser={currentUser} />
          </div>
        ) : null} */}
      </div>
    </div>
  );
}

export default Home;
