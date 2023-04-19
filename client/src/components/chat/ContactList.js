/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import userLib from '../user/userAPI';
import Contact from './Contact';

function ContactList(props) {
  const {
    activeUser, currentGroup, setChatContent, setMessageReceiver,
  } = props;
  // const activeUser = useSelector((state) => state.activeUser);
  const [contacts, setContacts] = useState();

  useEffect(async () => {
    if (currentGroup) {
      if (activeUser) {
        const filtered = currentGroup.members.filter((m) => m !== activeUser._id);
        console.log('filtered is', filtered);
        if (filtered.length !== 0) {
          const promises = filtered.map(async (userId) => {
            const userInfo = await userLib.getUserById(userId);
            return userInfo;
          });
          const allContactsInfo = await Promise.all(promises);
          console.log('here result is ~~~~~~~', allContactsInfo);
          setContacts(allContactsInfo);
        }
      }
    }
  }, []);

  return (
    <div className="ContactList">
      {contacts ? (
        <Contact activeUser={activeUser} contacts={contacts} setChatContent={setChatContent} setMessageReceiver={setMessageReceiver} />
      ) : null}
    </div>

  );
}
export default ContactList;
