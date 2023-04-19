/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../user/UserNameAvatar.css';
import userLib from '../user/userAPI';

function RequestAvatarText(props) {
  console.log('in FlaggedPostItem');
  const { post } = props;
  const defaultPic = 'https://facepic.qidian.com/qd_face/349573/a430412837/0';
  const [user, setUser] = useState();
  let picPath;// = defaultPic;
  useEffect(async () => {
    await userLib.getUserById(post.user_id).then((res) => {
      setUser(res);
      picPath = res.profile_image ? res.profile_image : defaultPic;
    });
  }, []);

  return (
    <div>
      {user ? (
        <>
          <img alt="pic1" src={picPath} />
          {/* only display the first X chars of post TODO text */}
          {/* <div className="userName">{post.text_content.substring(0, 5)}</div> */}
          <div className="userName">{post._id}</div>
        </>
      ) : (
        <p>No user</p>
      )}
    </div>
  );
}
export default RequestAvatarText;
