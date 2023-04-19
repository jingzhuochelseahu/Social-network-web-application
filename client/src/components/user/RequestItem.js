import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './UserNameAvatar.module.css';
import lib from './userAPI';
// TODO, remove this file!
function RequestItem(props) {
  const { request } = props;
  console.log(`in RequestItem request is ${request}`);
  const [user, setUser] = useState();
  useEffect(async () => {
    await lib.getUserById(request.userId).then((res) => {
      if (res !== '') {
        setUser(res);
        // console.log(res);
      }
    });
  }, []);

  return (
    <div>
      {user ? (
          <div className={classes.userName}>{user.username}</div>
      ) : ''}
    </div>
  );
}
export default RequestItem;