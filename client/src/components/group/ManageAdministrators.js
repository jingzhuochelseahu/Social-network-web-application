/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Checkbox, Divider } from 'antd';
import './ManageAdministrators.css';
import lib from '../user/userAPI';
import AdminList from '../user/AdminList';
import groupHelper from './groupAPI';

function ManageAdministrators(props) {
  // get the current group
  const { activeUser, currentGroup } = props;

  // get the options (exclude the group founder)
  // get the administrators (except the creator of the group
  const adminIdList = currentGroup.administrators.slice(1, currentGroup.administrators.length);
  const [admins, setAdmins] = useState([]);
  const [adminCandidates, setAdminCandidates] = useState([]);
  // const activeUser = useSelector((state) => state.activeUser);

  useEffect(() => {
    adminIdList.forEach(async (userId) => {
      await lib.getUserById(userId).then((user) => {
        admins.push(user);
      });
    });

    currentGroup.members.forEach(async (element) => {
      if (!currentGroup.administrators.includes(element)) {
        await lib.getUserById(element).then((candidate) => {
          adminCandidates.push(candidate);
        });
      }
    });
  }, []);

  return (props.trigger) ? (
    <div className="popupWindow">
      <div className="adminList">
        <p>Manage Administrators</p>
        <AdminList currentUser={activeUser} adminIds={adminIdList} selectedAdmins={admins} group={currentGroup} adminCandidates={adminCandidates} />
        <button type="button" className="ManageAdminutton" onClick={() => props.setTrigger(false)}>Close</button>
      </div>
    </div>
  ) : '';
}

export default ManageAdministrators;
