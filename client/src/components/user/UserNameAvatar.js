import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserNameAvatar.css';
import lib from './userAPI';

function UserNameAvatar(props) {
  const { userId } = props;
  const defaultPic = 'https://facepic.qidian.com/qd_face/349573/a430412837/0';
  const [user, setUser] = useState();
  const [picPath, setPicPath] = useState(defaultPic);
  useEffect(async () => {
    await lib.getUserById(userId).then((res) => {
      if (res !== '') {
        setUser(res);
        console.log(res);
        if (res.profile_image) {
          setPicPath(res.profile_image);
        }
      }
    });
  }, []);

  return (
    <div>
      {user ? (
        <>
          <img alt="pic1" src={picPath} />
          <div className="userName">{user.username}</div>
        </>
      ) : ''}
    </div>
  );
}
export default UserNameAvatar;
