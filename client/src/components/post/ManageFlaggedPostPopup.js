/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  Layout, Form, Input, Button, notification, Checkbox,
} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import postLib from './postAPI';
import './ManageFlaggedPostPopup.css';
import FlaggedPostItem from './FlaggedPostItem';

const { Content } = Layout;
const layout = {
  labelCol: { span: 8, offset: 4 },
  wrapperCol: { span: 16, offset: 4 },
};

function ManageFlaggedPostPopup(props) {
  console.log('HEY!!!');
  const {
    group, groupId, groupName, posts, activeUser,
  } = props;
  // const activeUser = useSelector((state) => state.activeUser);
  // const [newFlaggedPosts, setNewFlaggedPosts] = useState();
  const [flaggedPosts, setFlaggedPosts] = useState();

  // retrieved all flagged posts of this group
  useEffect(async () => {
    if (groupId) {
      await postLib.getFlaggedPostsByGroupId(groupId).then((res) => {
        console.log('got flagged posts in this group, they are ', res);
        setFlaggedPosts(res);
      });
    }
  }, []);

  const handleClick = () => {
    props.setTrigger(false);
    // props.updateFlaggedPosts(posts);
  };
  // const removeFromFlagged = () => {

  // };

  return (props.trigger) ? (
    <div className="popup">
      <div className="popup-inner">
        <Content>
          <div>
            <button type="button" id="button" onClick={handleClick}>
              Close
            </button>
            <div>
              <h3>Manage Flagged Posts For This Group</h3>
            </div>
            {flaggedPosts ? (
              <div>
                {flaggedPosts.map((post) => <FlaggedPostItem activeUser={activeUser} group={group} post={post} updatePosts={props.updatePosts} allPosts={posts} groupName={groupName} key={post._id} />)}
              </div>
            ) : (
              <p>No flagged posts yet</p>
            )}
          </div>
        </Content>
      </div>
    </div>
  ) : '';
}

export default ManageFlaggedPostPopup;
