/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostItem from './PostItem';

function PostList(props) {
  const {
    activeUser, posts, group, isAdmin,
  } = props;
  // const [showButtons, setShowButtons] = useState(true);
  console.log('in PostList, posts are ', posts);

  return (
    <div>
      {posts ? (
        <div>
          {posts.map((post) => <PostItem showButtons activeUser={activeUser} post={post} group={group} isAdmin={isAdmin} key={post._id} />)}
        </div>
      ) : null}
    </div>
  );
}
export default PostList;
