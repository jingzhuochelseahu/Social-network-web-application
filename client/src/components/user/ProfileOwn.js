/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { notification } from 'antd';
import { GroupOutlined, SmileTwoTone, SoundTwoTone } from '@ant-design/icons';
import Popup from 'reactjs-popup';
import GroupExhibition from './GroupExhibition';
import PostExhibitionItem from './PostExhibitionItem';
import UserInfo from './UserInfo';
import CreateJoinGroup from './CreateJoinGroup';
import groupLib from '../group/groupAPI';
import userLib from './userAPI';
import postLib from '../post/postAPI';
import invitesLib from '../group/invitesAPI';
import InvitesList from './InvitesList';
import './ProfileOwn.css';

const ProfileOwn = (props) => {
  const { currentUser } = props;
  // const activeUser = useSelector((state) => state.activeUser);
  // const { userid } = useParams();
  const [activeUser, setActiveUser] = useState();
  const [userPosts, setUserPosts] = useState(); // posts of this user
  // pull from db since fields like posts, chat, profile_image might change after we first set activeUser!
  // const [userData, setUserData] = useState();

  const [publicGroups, setPublicGroups] = useState([]);
  const [privateGroups, setPrivateGroups] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

  // fetch activeUser info from db, need to do this since user data might change, eg. groups they are in
  useEffect(async () => {
    console.log('in ProfileOwn, currentUser from props is ', currentUser);
    if (currentUser) {
      // we need to fetch for new info regarding this user!
      await (userLib.getUserById(currentUser._id)).then((res) => {
        console.log('activeUser is now', res);
        setActiveUser(res);
      });
      await invitesLib.getInvitesById(currentUser._id).then((res) => {
        console.log('invites for this user are ', res);
        if (res.length !== 0) {
          setPendingInvites(res);
          console.log('invites are not empty');
          // console.log(`pending Invites are ${pendingInvites}`);
        }
      });
    }
  }, []);

  useEffect(async () => {
    if (activeUser) {
      const { posts } = activeUser;
      if (posts.length !== 0) {
        const promises = posts.map(async (postId) => {
          const postInfo = await postLib.getPostById(postId);
          // console.log('post res is :', postInfo);
          return postInfo;
        });
        const allPostsInfo = await Promise.all(promises);
        setUserPosts(allPostsInfo);
        // console.log('************** userPosts is set to', allPostsInfo);
      }
    }
  }, [activeUser]);

  useEffect(async () => {
    if (activeUser) {
      if (activeUser.public_groups.length !== 0) {
        const promisesPublicGroups = activeUser.public_groups.map(async (publicGroupId) => {
          const publicInfo = await groupLib.getGroupById(publicGroupId);
          return publicInfo;
        });
        const allPublics = await Promise.all(promisesPublicGroups);
        setPublicGroups(allPublics);
      }

      if (activeUser.private_groups.length !== 0) {
        const promisesPrivateGroups = activeUser.private_groups.map(async (groupId) => {
          const privateInfo = await groupLib.getGroupById(groupId);
          return privateInfo;
        });
        const allPrivates = await Promise.all(promisesPrivateGroups);
        setPrivateGroups(allPrivates);
      }
    }
  }, [activeUser]);

  return (
    <div className="container">
      <div className="profileContainer">
        {activeUser ? (
          <>
            <div className="activeUserProfile">
              {/*= ====================LeftBar===================== */}
              {/*= ====================Your Groups===================== */}
              <GroupExhibition publicGroups={publicGroups} privateGroups={privateGroups} />
              <div className="CreateGroupBox">
                <CreateJoinGroup currentUser={currentUser} />
              </div>
            </div>
            <div className="PostsInfo">
              <p>Your Posts</p>
              {/*= ====================MiddlePart: Your Posts===================== */}
              {userPosts ? (
                userPosts.map((p) => <PostExhibitionItem key={p._id} post={p} />)
              ) : 'You have not posted yet'}
              {/*= ====================RightBar===================== */}
            </div>
            <div className="Right-Side">
              {/*= ====================User Information===================== */}
              <UserInfo user={activeUser} />
              {/*= ====================TODO Friend/Group request===================== */}
              <div className="InviteContainer">
                <div className="InviteInfo">Invites</div>
                {pendingInvites.length !== 0 ? (
                  <InvitesList pendingInvites={pendingInvites} />
                ) : (
                  <p>No invites</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">Login to view your profile!</Link>
        )}
      </div>
    </div>
  );
};
export default ProfileOwn;
