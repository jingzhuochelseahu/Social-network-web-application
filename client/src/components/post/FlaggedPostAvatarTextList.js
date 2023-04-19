/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FlaggedPostItem from './FlaggedPostAvatarText';

function FlaggedPostAvatarTextList(props) {
  const { posts } = props;
  console.log('in FlaggedPostList, posts are ', posts);

  return (
    <div>
      {posts ? (
        <div>
          {posts.map((post) => <FlaggedPostItem post={post} key={post._id} />)}
        </div>
      ) : null}
    </div>
  );
}
export default FlaggedPostAvatarTextList;
