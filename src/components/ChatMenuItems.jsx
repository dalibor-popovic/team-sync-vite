import { Box, Divider, Heading, Stack, useMediaQuery } from '@chakra-ui/react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { AnimatePresence, motion as m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { useStore } from '../store';
import { ChatMenuItem } from './ChatMenuItem';
import { GroupChatMenuItem } from './GroupChatMenuItem';

export const ChatMenuItems = () => {
  const [chats, setChats] = useState([]);

  const state = useStore((state) => state);

  const { user } = useAuth();

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  useEffect(() => {
    const chatsRef = collection(db, 'chats');

    const myChatsQuery = query(
      chatsRef,
      where('members', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsub = onSnapshot(myChatsQuery, (querySnapshot) => {
      if (querySnapshot.empty) {
        setChats([]);
        return;
      }

      let data = [];

      querySnapshot.docs.forEach((doc) => {
        if (!doc.data().lastMessage && doc.data().adminId !== user.uid) return;
        data.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      setChats(data);
    });

    return () => unsub();
  }, [user.uid]);

  return (
    <>
      <Box p='2'>
        <Heading size='sm' mt='3' fontWeight='400' letterSpacing='wide'>
          Direct messages
        </Heading>
        <Stack dir='column' mt='3' gap='1.5'>
          <AnimatePresence>
            {chats.map((chat) =>
              chat.members.length === 2 ? (
                <m.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ChatMenuItem
                    chatId={chat.id}
                    lastMessage={chat.lastMessage}
                    userId={
                      chat.members.filter(
                        (memberId) => memberId !== user.uid
                      )[0]
                    }
                    isSelected={state.selectedChat.id === chat.id}
                  />
                  {!isLargerThan800 ? (
                    <Divider
                      mt='2'
                      borderStyle='dashed'
                      borderColor='blackAlpha.300'
                    />
                  ) : null}
                </m.div>
              ) : (
                <m.div key={chat.id} layout>
                  <GroupChatMenuItem
                    key={chat.id}
                    chatId={chat.id}
                    lastMessage={chat.lastMessage}
                    usersIds={chat.members.filter(
                      (memberId) => memberId !== user.uid
                    )}
                    name={chat.name}
                    adminId={chat.adminId}
                    isSelected={state.selectedChat.id === chat.id}
                  />
                  {!isLargerThan800 ? (
                    <Divider
                      mt='2'
                      borderStyle='dashed'
                      borderColor='blackAlpha.300'
                    />
                  ) : null}
                </m.div>
              )
            )}
          </AnimatePresence>
        </Stack>
      </Box>
    </>
  );
};
