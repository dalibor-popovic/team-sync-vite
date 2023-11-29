import { useEffect, useState, useRef } from 'react';
import { ChatHeader } from '../components/ChatHeader';
import { MessageInput } from '../components/MessageInput';
import { Messages } from '../components/Messages';
import { useStore } from '../store';
import {
  onSnapshot,
  collection,
  query,
  where,
  documentId,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Box, useMediaQuery } from '@chakra-ui/react';

export const Chat = () => {
  const [usersList, setUsersList] = useState([]);
  const [users, setUsers] = useState({});

  const selectedChat = useStore((state) => state.selectedChat);

  const { user } = useAuth();

  const ref = useRef();

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  useEffect(() => {
    if (!selectedChat.id && selectedChat.uids.length === 0) return;

    const usersRef = collection(db, 'users');
    const myUsersQuery = query(
      usersRef,
      where(
        documentId(),
        'in',
        selectedChat.isGroupChat
          ? [...selectedChat.uids, user.uid]
          : [selectedChat.uid, user.uid]
      )
    );

    const unsub = onSnapshot(myUsersQuery, (querySnapshot) => {
      if (querySnapshot.empty) {
        return;
      }

      let data = [];
      let usersObject = {};

      querySnapshot.docs.forEach((doc) => {
        data.push({
          ...doc.data(),
          id: doc.id,
        });
        usersObject[doc.id] = { ...doc.data() };
      });

      setUsersList(data);
      setUsers(usersObject);
    });

    return () => unsub();
  }, [
    selectedChat.id,
    selectedChat.isGroupChat,
    selectedChat.uid,
    selectedChat.uids,
    user.uid,
  ]);

  const scrollToBottom = () => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <Box
      position={isLargerThan800 ? 'relative' : 'fixed'}
      top='0'
      bottom='0'
      left='0'
      right='0'
      overflow='hidden'
      display='flex'
      flexDir='column'
      h='full'
    >
      <ChatHeader
        users={usersList}
        name={selectedChat.name}
        adminId={selectedChat.adminId}
      />
      <Messages users={users} ref={ref} />
      <MessageInput users={users} scrollToBottom={scrollToBottom} />
    </Box>
  );
};
