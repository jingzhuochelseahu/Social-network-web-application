import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import './ProfileOwn.css';

function GroupRequest(props) {
  // const { user } = props;
  // const activeUser = useSelector((state) => state.activeUser);
  // const avatar = (activeUser && activeUser.profile_image) ? activeUser.profile_image : '../defaultAvatar.jpeg';
  // const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [requests, setRequests] = useState([]);
  setRequests([{ senderName: 'mike', groupName: 'petLover' }]);
  const acceptRequest = () => {

  };
  const rejectRequest = () => {

  };

  return (
    <div>
      Notifications
      <div className="groupMessage">
        {requests.length ? (
          <div className="requests">
            <ul>
              {requests.map((g) => (
                <span>
                  {`you've been invited to join ${g.groupName}`}
                  <button type="button" className="Accept" onClick={() => acceptRequest()}>Accept</button>
                  <button type="button" className="Reject" onClick={() => rejectRequest()}>Reject</button>
                </span>
              ))}
              ;
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default GroupRequest;
