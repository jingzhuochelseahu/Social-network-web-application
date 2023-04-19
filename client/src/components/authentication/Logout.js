/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Logout(props) {
  const socket = useSelector((state) => state.socket);
  useEffect(() => {
    props.onMount();
    socket.disconnect();
  });
  return <Navigate to="/login" />;
}

export default Logout;
