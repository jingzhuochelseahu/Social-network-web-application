/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import lib, {
  GroupOutlined, SmileTwoTone, SoundTwoTone, FrownTwoTone,
} from '@ant-design/icons';
import { notification } from 'antd';
import { io } from 'socket.io-client';
import './GroupBoard.css';
import MakePost from '../post/MakePost';
import UserList from '../user/UserList';
import GroupMembers from './GroupMembers';
import GroupNameAvatar from './GroupNameAvatar';
import PostList from '../post/PostList';
// import FlaggedPostsList from '../post/FlaggedPostAvatarTextList';
import postLib from '../post/postAPI';
import groupLib from './groupAPI';
import userLib from '../user/userAPI';
import userGroupLib from './userGroupAPI';
import requestLib from './requestAPI';
import { arraysEqual } from '../../helpers';
import ManageAdministrators from './ManageAdministrators';
import ManageFlaggedPostPopup from '../post/ManageFlaggedPostPopup';
import RequestsList from './RequestsList';
import invitesLib from './invitesAPI';
// import { socket } from '../../reducers';
// import { set } from 'mongoose';

import FilterResPopup from './FilterResPopup';

function GroupBoard(props) {
  const { currentUser } = props;
  const { groupid } = useParams();
  const [currGroup, setCurrGroup] = useState();
  const [isPublic, setIsPublic] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  // const [adminFlaggedPost, setAdminFlaggedPost]
  const [searchContent, setSearchContent] = useState();
  const [activeUser, setActiveUser] = useState();

  // const activeUser = useSelector((state) => state.activeUser);
  // let activeUser;
  const [posts, setPosts] = useState();
  // const [flaggedPosts, setFlaggedPosts] = useState();
  const [hasNewFlagged, setHasNewFlagged] = useState(false);
  const [showManageFlaggedPostPopUp, setShowManageFlaggedPostPopUp] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [showFilterResPopUp, setShowFilterResPopUp] = useState(false);
  const [filteredRes, setFilteredRes] = useState();
  const [popupOpen, setpopupOpen] = useState(false);
  const [sentInvite, setSentInvite] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(async () => {
    console.log('in GroupBoard, groupid is ', groupid);
    console.log('currentUser prop is', currentUser);
    // fetch activeUser info from db, need to do this since user data might change, eg. groups they are in
    if (currentUser) {
      console.log('in Home, currentUser id is ', currentUser._id);
      // we need to fetch for new info regarding this user!
      await (userLib.getUserById(currentUser._id)).then((res) => {
        console.log('activeUser is now', res);
        setActiveUser(res);
      });
    }
    // get current group info
    await groupLib.getGroupById(groupid).then(async (g) => {
      console.log('Curr group is ', g);
      setCurrGroup(g);
      if (g.public === 1) {
        setIsPublic(true);
        console.log('this is a public group!');
      } else {
        console.log('this is a private group!');
      }
    });
  }, []);

  useEffect(() => {
    setSocket(io('http://localhost:3000'));
  }, []);

  useEffect(() => {
    socket?.emit('newUser', activeUser);
  }, [socket, activeUser]);

  // useEffect(async () => {
  //   console.log('in pending request');
  //   // get current group info
  //   if (currGroup.requests !== undefined) {
  //     setPendingRequests(currGroup.requests);
  //   }
  // }, []);

  const handleAddNewPost = async (newPostId) => {
    console.log('in handelAddNewPost, new post id is', newPostId);
    // setPosts((posts) => [...posts, newPost]);
    // reget from db to include the new ID!
    await postLib.getPostsByGroupId(currGroup._id).then((res) => {
      console.log('updated posts in this group are ', res);
      setPosts(res);
    });
  };

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSubmitFilter = () => {
    // can filter on @ or # of both post and comments
    // console.log(`in handleSubmitFilter, filter text is [${filterText}]`);
    // filterText must start with @ or #
    console.log('---------!posts are: ', posts);
    let postRes;
    let commentRes;
    if (filterText.startsWith('@')) {
      const term = filterText.substring(1);
      // postLib.filterGroupPostOnMentioned(term);
      console.log('filter term on mentioned is', term);
      postRes = posts.filter((post) => post.mentioned && post.mentioned.includes(term));
      console.log('postres is', postRes);
      commentRes = posts.filter((post) => post.comments && post.comments.length !== 0 && (
        post.comments.filter((comment) => comment.mentioned.length !== 0 && comment.mentioned.includes(filterText)).length !== 0
      ));
      console.log('commentRes1 is', commentRes);
    } else if (filterText.startsWith('#')) {
      const term = filterText.substring(1);
      // postLib.filterGroupPostOnTag(term,);
      console.log('filter term on hashtag is', term);
      postRes = posts.filter((post) => post.hashtags && post.hashtags.includes(term));
      console.log('post Res is', postRes);
      commentRes = posts.filter((post) => post.comments && post.comments.length !== 0 && (
        post.comments.filter((comment) => comment.hashtags.lenth !== 0 && comment.hashtags.includes(filterText)).length !== 0
      ));
      console.log('commentRes2 is', commentRes);
    } else {
      // alert('Filter keyword must start with @ or #!');
      notification.open({
        message: 'Filter keyword must start with @ or #!',
        type: 'error',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
      return;
    }
    // merge 2 res into one, remove dup
    let res;
    if (postRes && commentRes) {
      res = postRes.concat(commentRes);
      res = [...new Set([...postRes, ...commentRes])];
    } else if (postRes) {
      res = postRes;
    } else if (commentRes) {
      res = commentRes;
    }
    console.log('final res is ', res);
    // show result in a popup
    setFilteredRes(res);
    console.log('res res', res);
  };

  useEffect(() => {
    setShowFilterResPopUp(true);
  }, [filteredRes]);

  useEffect(async () => {
    if (currGroup) {
      // await postLib.getPostsByGroupId(currGroup._id).then((res) => {
      await postLib.getPostsByGroupId(currGroup._id).then((res) => {
        console.log('posts in this group are ', res);
        setPosts(res);
      });
      if (activeUser) { // TODO, currGroup won't work, has to use g
        // check if the current user is admin of this group
        console.log('activeUser is ', activeUser);
        if (currGroup.administrators.includes(activeUser._id)) {
          // if (g.administrators.includes(activeUser._id)) {
          console.log('the user is admin of this group!');
          setIsAdmin(true);
          await requestLib.getRequestsById(groupid).then((res) => {
            console.log('requests in this group are ', res);

            if (res.length !== 0) {
              setPendingRequests(res);
              console.log('requests are not empty');
            } else {
              setPendingRequests([]);
              console.log('requests are not empty');
            }
          });
        }
        if (currGroup.members.includes(activeUser._id)) {
          // if (g.members.includes(activeUser._id)) {
          console.log('the user is member of this group!');
          setIsMember(true);
        }
      }
    }
  }, [currGroup]);

  const sendInvite = async () => {
    const invitedUser = document.getElementById('invitedUser').value;
    console.log(`invitedUser's name is ${invitedUser}`);
    // const receiver = userLib.getUserByName(invitedUser);// get user by name
    const receiver = await userLib.getUserByName(invitedUser);// get user by id
    console.log(`invited user's id is ${receiver._id}`);
    await invitesLib.createInvite(receiver._id, activeUser._id, currGroup._id, currGroup.name).then((res) => {
      console.log('sent Invite', res);
    });
    notification.open({
      message: `Invited ${invitedUser}`,
      icon: <SmileTwoTone />,
      duration: 2,
      closeIcon: (<div />), // hide the close btn
    });
    setSentInvite(true);
    socket.emit('sendUserNotification', {
      senderName: activeUser._id,
      receiverName: receiver._id,
      groupName: currGroup._id,
    });
  };

  const joinGroupHandler = async () => {
    // Each group has pending user ids. Admin sees it, approve, deny. Add them to the group. Send notification.
    if (activeUser) {
      if (!sentRequest) {
        notification.open({
          message: 'Sent a request to Join!',
          icon: <SmileTwoTone />,
          duration: 2,
          closeIcon: (<div />), // hide the close btn
        });
        setSentRequest(true);
        await requestLib.createRequest(currentUser._id, currGroup._id, currentUser.username).then((res) => {
          console.log('sent Request', res);
        });
      } else {
        notification.open({
          message: 'You already sent a request!',
          icon: <SmileTwoTone />,
          duration: 2,
          closeIcon: (<div />), // hide the close btn
        });
      }
    } else {
      notification.open({
        message: 'Please login!',
        icon: <FrownTwoTone />,
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    }
    // return updated group and updated user
  };

  const leaveGroupHandler = async () => {
    if (activeUser) {
      const updatedUserPublicGroups = activeUser.public_groups.filter((item) => item !== currGroup._id);
      const newActiveUser = { public_groups: updatedUserPublicGroups };
      const updatedGroupMembers = currGroup.members.filter((item) => item !== currentUser._id);
      const newCurrGroup = { members: updatedGroupMembers };
      await userLib.updateUserByAttrib(activeUser._id, newActiveUser);
      await groupLib.updateGroup(currGroup._id, newCurrGroup);
      setIsMember(false);
      notification.open({
        message: 'You have left the group!',
        icon: <SmileTwoTone />,
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    } else {
      notification.open({
        message: 'Please login!',
        icon: <FrownTwoTone />,
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    }
  };

  const handleStartAChat = () => {
    navigate(`./chat/${activeUser._id}`);
  };

  const cleanBox = () => {
    // clear filter input box content
    const inputBox = document.getElementById('filter');
    inputBox.value = '';
  };

  return (
    <div className="container">
      {!currGroup
        ? null : (
          <div className="mainContent">
            {/*= ====================leftNavBar===================== */}
            <div className="leftNavBar">
              {/*= ====================CurrentGroup Name & Avatar===================== */}
              <GroupNameAvatar currentGroup={currGroup} />
              {/*= ====================Group Members===================== */}
              <div className="groupList">
                <div className="groupListTitle">Group Members</div>
                <GroupMembers currentGroup={currGroup} />
                {/*= ====================Invite Members===================== */}
                {activeUser && isMember ? (
                  <>
                    {!isPublic ? (
                      <form className="groupInvite">
                        <div className="inputStyle">
                          <input id="invitedUser" placeholder="Type Name" />
                        </div>
                        <button type="button" className="btnStyle" onClick={() => sendInvite()}>Invite</button>
                      </form>
                    ) : null}
                    <button type="button" className="btnStyle" onClick={() => handleStartAChat()}>Start a Chat</button>
                  </>
                ) : ''}
              </div>
            </div>
            <div className="posts">
              {activeUser && isMember ? (
                <div className="makePostsArea">
                  {/*= ====================Make a post===================== */}
                  {/* shoudl only allow the user to see MakePost if the user is logged in and is a member of this group! */}
                  <MakePost activeUser={activeUser} groupId={currGroup._id} members={currGroup.members} posts={posts} addPost={handleAddNewPost} />
                </div>
              ) : null}
              <div className={isMember ? 'groupPostsExhibition' : 'groupPostsExhibitionNotMember'}>
                {/*= ====================Display Post List===================== */}
                {posts && posts.length !== 0 ? (
                  <PostList activeUser={activeUser} posts={posts} group={currGroup} isAdmin={isAdmin} />
                ) : (
                  <p>No posts yet</p>
                )}
              </div>
            </div>
            {/*= ====================rightNavBar===================== */}
            <div className="rightNavBar">
              {/*= ====================Administrators===================== */}
              <div className="adminInfo">
                <div className="adminListTitle">Administrators</div>
                <UserList users={currGroup.administrators} />
              </div>
              {isAdmin ? (
                <div className="adminManage">
                  {/*= ====================Manage Admins===================== */}
                  <button type="button" className="btnStyle" onClick={() => setpopupOpen(true)}>Manage Administrators</button>
                </div>
              ) : null}
              {/*= ====================Leave Or Join Group===================== */}
              {isMember ? (
                <button type="button" className="btnStyle" onClick={leaveGroupHandler}>Leave Group</button>
              ) : null}
              {sentRequest && !isMember ? (
                <button type="button" className="btnStyle" onClick={joinGroupHandler}>Request Sent</button>
              ) : null}
              {!sentRequest && !isMember
                ? (<button type="button" className="btnStyle" onClick={joinGroupHandler}>Join Group</button>
                ) : null}
              {/*= ====================Flagged Post viewable by administrators===================== */}
              {isAdmin ? (
                <>
                  <div className="flaggedList">
                    <div className="flaggedListTitle">Flagged Posts</div>
                    {/* {flaggedPosts ? (
                      <FlaggedPostsList posts={flaggedPosts} />
                    ) : null} */}
                    <button type="button" className="btnStyle2" onClick={() => setShowManageFlaggedPostPopUp(true)}>Manage</button>
                  </div>
                  {/*= ====================Pending requests===================== */}
                  <div className="flaggedList">
                    <div className="flaggedListTitle">Pending Requests</div>
                    {pendingRequests.data ? (
                      <RequestsList pendingRequests={pendingRequests} groupId={groupid} />
                    ) : (
                      <p>No requests</p>
                    )}
                  </div>
                </>
              ) : null}
              {/*= ====================Filter posts or comments===================== */}
              <div className="groupList">
                <div className="inputStyle">
                  <input id="filter" placeholder="@someone or #tag" onChange={handleFilterTextChange} />
                </div>
                <button type="button" className="btnStyle" onClick={handleSubmitFilter}>Filter</button>
              </div>
            </div>
            {/* All Popups go here */}
            {/* FILTER ON POSTS AND COMMENTS POPUP */}
            {filteredRes && showFilterResPopUp && activeUser ? (
              <FilterResPopup group={currGroup} activeUser={activeUser} posts={filteredRes} trigger={showFilterResPopUp} setTrigger={setShowFilterResPopUp} resetRes={setFilteredRes} cleanFilterBox={cleanBox}>
                <h3>My POPUP</h3>
              </FilterResPopup>
            ) : null}
            <div>
              <ManageFlaggedPostPopup trigger={showManageFlaggedPostPopUp} setTrigger={setShowManageFlaggedPostPopUp} activeUser={activeUser} group={currGroup} groupId={groupid} posts={posts} updatePosts={setPosts} groupName={currGroup.name}>
                <h3>My Manage flag posts POPUP</h3>
              </ManageFlaggedPostPopup>
            </div>
            <ManageAdministrators activeUser={activeUser} currentGroup={currGroup} trigger={popupOpen} setTrigger={setpopupOpen}>
              <h3>Manage Administrators</h3>
            </ManageAdministrators>

          </div>
        )}
    </div>
  );
}

export default GroupBoard;
