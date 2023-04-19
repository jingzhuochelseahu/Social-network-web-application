import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './CreateJoinGroup.css';

function CreateJoinGroup(props) {
  const { currentUser } = props;
  const navigate = useNavigate();
  const createGroup = () => {
    // window.location.href = `http://localhost:3000/createGroup/${currentUser._id}`;
    navigate(`/createGroup/${currentUser._id}`);
  };

  return (
    <div className="CreateGroup">
      <button type="button" className="CreateNewGroupButton" onClick={() => createGroup()}>Create a New Group</button>
    </div>
  );
}
export default CreateJoinGroup;
