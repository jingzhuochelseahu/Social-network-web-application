/* eslint-disable react/destructuring-assignment */
// display filterd results for posts and comments for a group, can filter on @ or #
import { React, useRef, useEffect } from 'react';
import PostItem from '../post/PostItem';
import './FilterResPopup.css';

function FilterResPopup(props) {
  const { activeUser, posts, group } = props;
  // const [showButtons, setShowButtons] = useState(false);
  const handleClose = () => {
    props.setTrigger(false);
    props.resetRes();
    props.cleanFilterBox();
  };

  return (props.trigger ? (
    <div className="respopup">
      <div className="respopup-inner">
        {posts && posts.length !== 0 ? (
          <div>
            {posts.map((post) => <PostItem showButtons={false} post={post} activeUser={activeUser} group={group} isAdmin={false} key={post._id} />)}
          </div>
        ) : 'No Filtered Result!'}
        <button id="respopupBtn" type="button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  ) : '');
}

export default FilterResPopup;
