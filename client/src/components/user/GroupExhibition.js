/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import lib from '../group/groupAPI';
import { addGroup } from '../../actions/index';
import './GroupExhibition.css';

function GroupExhibition(props) {
  // const groups = useSelector((state) => state.groups);
  const { publicGroups, privateGroups } = props;
  // const [activeUser, setActiveUser] = useState();
  const navigate = useNavigate();

  const handleClickGroup = (e) => {
    console.log('parent is ', e.target.parentNode);
    // to pass groupid as param?
    const { id } = e.target.parentNode;
    navigate(`/groupboard/${id}`);
  };

  return (
    <div className="Profile-Group-exhibition">
      <p className="Manage-Group">Mange Your Groups</p>
      <p className="Public">Public Groups </p>
      {publicGroups.length > 0 ? (
        <div className="Profile-Public-Group">
          <ul>
            {publicGroups.map((g) => (
              <li key={g.name} id={g._id}>
                <img src={g.profile_image} className="GroupProfileImg" alt="" />
                {g.name}
                <button type="button" className="VisitButton" onClick={handleClickGroup}>Visit</button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="Private">Private Groups </p>
      {privateGroups.length > 0 ? (
        <div className="Profile-Private-Group">
          <ul>
            {privateGroups.map((g) => (
              <li key={g.name} id={g._id}>
                <img src={g.profile_image} className="GroupProfileImg" alt="" />
                {g.name}
                <button type="button" className="VisitButton" onClick={handleClickGroup}>Visit</button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
export default GroupExhibition;
