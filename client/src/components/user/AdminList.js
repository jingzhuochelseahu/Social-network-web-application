/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { SmileTwoTone } from '@ant-design/icons';
import './UserNameAvatar.css';
import lib from '../group/groupAPI';

function AdminList(props) {
  const {
    group, selectedAdmins, adminIds, adminCandidates, currentUser,
  } = props;

  // get the socket connection
  const socket = useSelector((state) => state.socket);

  const [checkedState, setCheckedState] = useState(
    new Array(selectedAdmins.length).fill(false),
  );

  const [selectedState, setSelectedState] = useState(
    new Array(adminCandidates.length).fill(false),
  );
  const [modifiedAdmins, setModifiedAdmins] = useState(adminIds);
  const [addedAdmins, setAddedAdmins] = useState([]);

  const handleOnChange = (e, position) => {
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));
    setCheckedState(updatedCheckedState);
    // change the id list based on the false position
    if (updatedCheckedState[position]) {
      if (modifiedAdmins.includes(e.target.value)) {
        for (let i = 0; i < modifiedAdmins.length; i += 1) {
          if (modifiedAdmins[i] === e.target.value) {
            modifiedAdmins.splice(i, 1);
          }
        }
      }
    } else if (!modifiedAdmins.includes(e.target.value)) {
      modifiedAdmins.push(e.target.value);
    }
  };

  const handleOnSelect = (e, position) => {
    const updatedSelectedState = selectedState.map((item, index) => (index === position ? !item : item));
    setSelectedState(updatedSelectedState);

    if (updatedSelectedState[position]) {
      modifiedAdmins.push(e.target.value);
      addedAdmins.push(e.target.value);
    } else if (modifiedAdmins.includes(e.target.value)) {
      for (let i = 0; i < modifiedAdmins.length; i += 1) {
        if (modifiedAdmins[i] === e.target.value) {
          modifiedAdmins.splice(i, 1);
        }
      }
      for (let k = 0; k < addedAdmins.length; k += 1) {
        if (addedAdmins[k] === e.target.value) {
          addedAdmins.splice(k, 1);
        }
      }
    }
  };

  const deleteAdmin = async () => {
    if (!modifiedAdmins.includes(group.administrators[0])) {
      modifiedAdmins.unshift(group.administrators[0]);
    }
    const newGroup = {
      administrators: modifiedAdmins,
    };
    await lib.updateGroup(group._id, newGroup).then(() => {
      notification.open({
        message: 'Delete administrators successfully!',
        icon: <SmileTwoTone />,
        // type: 'success',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    });
  };

  const addAdmin = async () => {
    if (!modifiedAdmins.includes(group.administrators[0])) {
      modifiedAdmins.unshift(group.administrators[0]);
    }
    const newGroup = {
      administrators: modifiedAdmins,
    };
    await lib.updateGroup(group._id, newGroup).then(() => {
      notification.open({
        message: 'Add administrators successfully!',
        icon: <SmileTwoTone />,
        // type: 'success',
        duration: 2,
        closeIcon: (<div />), // hide the close btn
      });
    });

    if (group) {
      addedAdmins.forEach((memberId) => {
        socket?.emit('SendAddAdminNotification', {
          senderId: currentUser._id,
          senderName: currentUser.username,
          receiverId: memberId,
          group: group.name,
        });
      });
    }
  };

  return (
    <div className="ManageAdminBox">
      <div className="AdminList">
        {selectedAdmins.length !== 0 ? (
          <div className="adminListMember">
            <ul id="deleteAdmin">
              {selectedAdmins.map((admins, index) => (
                <li className="information">
                  <input
                    type="checkbox"
                    id={index}
                    name={admins.username}
                    value={admins._id}
                    checked={checkedState[index]}
                    onChange={(e) => handleOnChange(e, index)}
                  />
                  <img alt="pic1" src={admins.profile_image} />
                  {admins.username}
                </li>
              ))}
              <button type="button" className="ManageAdminButton" onClick={() => deleteAdmin()}>Delete</button>
            </ul>
          </div>
        ) : null}
        {adminCandidates.length !== 0 ? (
          <div className="adminListMember">
            <ul id="addAdmin">
              {adminCandidates.map((members, index) => (
                <li className="candidate">
                  <input
                    type="checkbox"
                    id={index}
                    name={members.username}
                    value={members._id}
                    checked={selectedState[index]}
                    onChange={(e) => handleOnSelect(e, index)}
                  />
                  <img alt="pic2" src={members.profile_image} />
                  {members.username}
                </li>
              ))}
              <button type="button" className="ManageAdminButton" onClick={() => addAdmin()}>Add</button>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default AdminList;
