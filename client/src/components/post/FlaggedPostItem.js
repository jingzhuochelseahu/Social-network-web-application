/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import postLib from './postAPI';
import userLib from '../user/userAPI';
import PostItem from './PostItem';
import { deleteFlaggedPost, unflagPost } from '../../actions';
import './FlaggedPostItem.css';
// import { ConsoleSqlOutlined } from '@ant-design/icons';

function FlaggedPostItem(props) {
  const {
    activeUser, post, allPosts, groupName, group, updatePosts,
  } = props;
  const [showPost, setShowPost] = useState(true);// whether to show or hide this post
  const [flagger, setFlagger] = useState();
  // const [showButtons, setShowButtons] = useState(false)
  // get the socket connection
  const socket = useSelector((state) => state.socket);
  console.log('0_____________________ currUser is', activeUser);

  useEffect(async () => {
    // need to get it since we want the flagger's name
    await userLib.getUserById(post.flagger).then((res) => {
      setFlagger(res);
    });
  }, []);

  const handleDelete = async () => {
    console.log('post need to be deleted : ', post);
    await postLib.deletePost(post._id).then((res) => {
      console.log('successfully deleted ', res);
      setShowPost(false);// now hide this post in the popup
      console.log('delete flagged post success, going to send notif');
      notification.open({
        message: 'Successfully deleted Post!',
        // icon: <SmileTwoTone />,
        type: 'success',
        duration: 1,
        closeIcon: (<div />), // hide the close btn
      });
      // lift state up, update posts in the GroupBoard
      // remove this deleted post from all posts
      console.log('all posts in this group are', allPosts);
      // const idx = allPosts.indexOf(post);
      let idx = -1;
      for (let i = 0; i < allPosts.length; i += 1) {
        if (allPosts[i]._id === post._id) {
          idx = i;
          break;
        }
      }
      if (idx >= 0) {
        allPosts.splice(idx, 1);
      }
      console.log('after removing this one, now all posts are', allPosts);
      props.updatePosts(allPosts);
      // send notification to poster and flagger
      socket?.emit('SendDeletePostNotificationToPoster', {
        receiverId: post.user_id,
        groupName,
      });
      socket?.emit('SendDeletePostNotificationToFlagger', {
        receiverId: flagger._id,
        groupName,
      });
    });
  };

  const handleUnflag = async () => {
    console.log('handle unflag! post is : ', post);
    await postLib.unflagPost(post._id).then((res) => {
      console.log('successfully unflagged ', res);
      setShowPost(false);// now hide this post in the popup

      console.log('going to send notif');

      // notification
      notification.open({
        message: 'Successfully unflagged Post!',
        type: 'success',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
      // send notif to flagger
      socket?.emit('SendUnflagPostNotification', {
        receiverId: flagger._id,
        groupName,
      });
    });
  };

  return (
    <div>
      {post && flagger && showPost ? (
        <div className="post1">
          <p>
            Post id:
            {' '}
            {post._id}
          </p>
          <div className="FlaggedPostContent">
            <PostItem showButtons={false} post={post} activeUser={activeUser} group={group} isAdmin={false} key={post._id} />
          </div>
          <div className="flagger">
            Flagged by:
            {' '}
            {flagger.username}
          </div>
          <div className="DeleteEditPost">
            <button type="button" className="DeletePost" onClick={handleDelete}>Delete Post</button>
            |
            <button type="button" className="EditPost" onClick={handleUnflag}>Unflag Post</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default FlaggedPostItem;
