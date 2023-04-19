/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
// create a new group
import React, { useState, useEffect } from 'react';
import {
  Layout, Form, Input, Button, notification, Upload, message, Radio,
} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LoadingOutlined, PlusOutlined, FrownOutlined } from '@ant-design/icons';
import { Provider, useDispatch, useSelector } from 'react-redux';
import './CreateGroup.css';
import groupLib from './groupAPI';
import userLib from '../user/userAPI';
import DefaultGroupAvatar from '../defaultAvatar.jpeg';

const { Content } = Layout;
const layout = {
  labelCol: { span: 6, offset: 4 },
  wrapperCol: { span: 10, offset: 4 },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function CreateGroup() {
  const [activeUser, setActiveUser] = useState();
  const { userid } = useParams();
  const [groupAvatar, setgroupAvatar] = useState();
  const [picFile, setPicFile] = useState();

  // const activeUser = useSelector((state) => state.activeUser);

  const [groupType, setGroupType] = useState(-1);
  const [groupTags, setGroupTags] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // fetch activeUser info from db, need to do this since user data might change, eg. groups they are in
  useEffect(async () => {
    console.log('in CreateGroup, userid in params is ', userid);
    if (userid) {
      // we need to fetch for new info regarding this user!
      await (userLib.getUserById(userid)).then((res) => {
        console.log('activeUser is now', res);
        setActiveUser(res);
      });
    }
  }, []);

  const cleanup = () => {
    // clear input file name
    const fileBox = document.getElementById('input');
    fileBox.value = '';
    setgroupAvatar();
    setPicFile();
  };

  const setPublic = (e) => {
    setGroupType(e.target.value);
    console.log('Group type is', groupType);
  };

  const updateGroupTags = (e) => {
    let tags = e.target.value;
    tags = tags.split(',');
    const tagList = [];
    // go over each element in th input
    for (let i = 0; i < tags.length; i += 1) {
      tags[i] = tags[i].trim();
      tagList.push(tags[i]);
    }
    setGroupTags(tagList);
  };

  const updateGroupName = (e) => {
    setGroupName(e.target.value);
  };

  async function createNewGroup() {
    // console.log('Group name is', groupName);
    // console.log('Group tags are', groupTags);
    // console.log('The user is', activeUser);
    // create a new group
    if (groupName === '') {
      notification.open({
        message: 'Please enter the group name!',
        icon: <FrownOutlined />,
        type: 'failed to create a group',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    } else if (groupTags === []) {
      notification.open({
        message: 'Please enter the group tags!',
        icon: <FrownOutlined />,
        type: 'failed to create a group',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    } else if (groupType === -1) {
      notification.open({
        message: 'Please choose a group type!',
        icon: <FrownOutlined />,
        type: 'failed to create a group',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    // } else if (groupImage === '') {
    } else if (!groupAvatar || groupAvatar === '') {
      notification.open({
        message: 'Please upload a group image!',
        icon: <FrownOutlined />,
        type: 'failed to create a group',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    } else {
      // const groupId = await groupLib.createNewGroup(groupName, groupType, groupTags, groupImage, activeUser._id);
      const groupId = await groupLib.createNewGroup(groupName, groupType, groupTags, groupAvatar, activeUser._id);
      console.log(groupId.data);

      const newUserGroupInfo = {};
      if (groupType === 1) {
        activeUser.public_groups.push(groupId.data);
        newUserGroupInfo.public_groups = activeUser.public_groups;
        navigate(`/groupboard/${groupId.data}`);
      } else {
        activeUser.private_groups.push(groupId.data);
        newUserGroupInfo.private_groups = activeUser.private_groups;
        navigate(`/groupboard/${groupId.data}`);
      }
      cleanup();
      const updatedUser = await userLib.updateUserByAttrib(activeUser._id, newUserGroupInfo);
      // console.log('((((((((((((((updated user is', updatedUser);
    }
  }

  const handleFileChange = (e) => {
    // console.log('file change');
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        // console.log(reader.result);
        setgroupAvatar(reader.result);// actual data url
      }
    };
    const file = e.target.files[0]; // file with name, size, etc
    reader.readAsDataURL(file);
    // console.log(file);
    setPicFile(file);
    // check size
    const isLt4M = file.size / 1024 / 1024 < 4;
    if (!isLt4M) {
      notification.open({
        message: 'Image must be smaller than 4MB!',
        type: 'warning',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
      cleanup();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Create Group Failed:', errorInfo);
  };

  return (
    <Content>
      <div className="container">
        <Form
          {...layout}
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={createNewGroup}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Group Name"
            name="groupname"
            rules={[
              { required: true, message: 'Please enter the new group name' },
              {
                pattern: /^[a-zA-Z0-9,._!?@#$&* " "]+$/,
                message: 'Group Name Should be Captalized',
              },
            ]}
          >
            <Input
              size="large"
              onChange={(e) => updateGroupName(e)}
            />
          </Form.Item>

          <Form.Item
            label="Group Tag(s) (separate by comma)"
            name="grouptags"
            rules={[
              { required: true, message: 'Please enter group tags' },
              {
                pattern: /^[a-zA-Z0-9,._!?@#$&* " "]*$/,
                message: '',
              },
            ]}
          >
            <Input
              size="large"
              onChange={(e) => updateGroupTags(e)}
            />
          </Form.Item>

          <Form.Item
            label="Group Type"
            name="grouptype"
            rules={[
              { required: true, message: 'Please choose the group type' },
            ]}
          >
            <Radio.Group onChange={setPublic} value={groupType}>
              <Radio value={1}>Public</Radio>
              <Radio value={0}>Private</Radio>
            </Radio.Group>
          </Form.Item>

          {/* <Form.Item>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="http://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {groupImage ? <img src={groupImage} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item> */}

          <div className="img-holder">
            {groupAvatar ? (
              <img src={groupAvatar} alt="" id="img" />
            ) : (
              <img src={DefaultGroupAvatar} alt="" id="img" />
            )}
          </div>
          <input className="image-label" type="file" accept="image/*" name="image-upload" id="input" onChange={handleFileChange} />

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>

        {/* <div className="create-button">
          <button type="button" className="CreateNewGroup" onClick={(e) => createNewGroup(e)}>Create</button>
        </div> */}
      </div>
    </Content>
  );
}

export default CreateGroup;
