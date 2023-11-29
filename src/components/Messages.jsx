import { Avatar, Box, Flex, Spinner, useMediaQuery } from '@chakra-ui/react';
import { format, isThisMinute, isToday } from 'date-fns';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { AnimatePresence, motion as m } from 'framer-motion';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { DateTimestamp } from './DateTimestamp';
import { Message } from './Message';

const variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const Messages = forwardRef(function MessagesComponent({ users }, ref) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [lastMessageDate, setLastMessageDate] = useState(null);

  const { user } = useAuth();

  const { id } = useParams();

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  const getDateMessage = (date) => {
    return isThisMinute(date)
      ? 'Just now'
      : isToday(date)
      ? 'Today'
      : date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const chatRef = collection(db, 'chats', id, 'messages');

    let messagesObject = {};

    const q = query(chatRef, orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setMessages([]);
        setLastMessageDate(null);
        setLoading(false);
        return;
      }

      let data = [];

      querySnapshot.docs.forEach((doc, i) => {
        if (doc.data().createdAt === null) return;

        messagesObject[doc.id] = { ...doc.data(), id: doc.id };

        if (i == querySnapshot.docs.length - 1) {
          let docDate = doc.data().createdAt.toDate();
          let lastDate = getDateMessage(docDate);
          setLastMessageDate(lastDate);
        }

        let previousItem = null;

        if (i != 0) {
          previousItem = querySnapshot.docs[i - 1].data();
        }

        if (previousItem && previousItem.createdAt) {
          const currMsgMillis = doc.data().createdAt.toMillis();
          const currMsgDate = new Date(currMsgMillis).setHours(0, 0, 0, 0);
          const prevMsgMillis = previousItem.createdAt.toMillis();
          const prevMsgDate = new Date(prevMsgMillis).setHours(0, 0, 0, 0);

          if (currMsgDate != prevMsgDate) {
            let prevDocDate = previousItem.createdAt.toDate();

            let prevLastDate = getDateMessage(prevDocDate);

            data.push({
              isDate: true,
              date: prevLastDate,
              id: i,
            });
          }
        }

        data.push({
          ...doc.data(),
          isDate: false,
          id: doc.id,
        });
      });

      setMessages(
        data.map((item) =>
          item.replyId
            ? { ...item, replyMessage: messagesObject[item.replyId] }
            : item
        )
      );
      setLoading(false);
    });

    return () => unsub();
  }, [id]);

  if (isLoading) {
    return (
      <Box display='grid' placeItems='center' h='100vh'>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      flex='1'
      py='8'
      px={isLargerThan800 ? 8 : 2}
      mx={isLargerThan800 ? 4 : 0}
      display='flex'
      flexDir='column-reverse'
      overflow='overlay'
      border='1px'
      borderColor='blackAlpha.400'
      rounded={isLargerThan800 ? '3xl' : 0}
      borderStyle='dashed'
      className='chat-bg-pattern prevent-select'
    >
      <AnimatePresence>
        <div ref={ref}></div>
        {messages.map((message) => {
          const sender = message.userId === user.uid;
          if (message.isDate) {
            return (
              <m.div
                key={message.id}
                layout
                animate='animate'
                exit='exit'
                initial='initial'
                variants={variants}
              >
                <DateTimestamp date={message.date} />
              </m.div>
            );
          }

          const time = message?.createdAt
            ? format(message.createdAt.toDate(), 'HH:mm')
            : '';

          return (
            <m.div
              key={message.id}
              layout
              animate='animate'
              exit='exit'
              initial='initial'
              variants={variants}
            >
              <Flex
                h='fit-content'
                mt='3'
                flexDir={sender ? 'row-reverse' : 'row'}
              >
                {users[message.userId]?.name ? (
                  <Avatar
                    size='xs'
                    mt='2'
                    name={users[message.userId]?.name}
                    src={users[message.userId]?.url}
                  />
                ) : null}
                <Message
                  isSender={sender}
                  text={message.text}
                  time={time}
                  seen={message.seen ?? []}
                  chatId={id}
                  id={message.id}
                  messageUserId={message.userId}
                  users={users}
                  like={message.like ?? []}
                  replyMessage={message.replyMessage}
                />
              </Flex>
            </m.div>
          );
        })}
        {lastMessageDate ? (
          <m.div
            key='lastOne'
            layout
            animate='animate'
            exit='exit'
            initial='initial'
            variants={variants}
          >
            <DateTimestamp date={lastMessageDate} />
          </m.div>
        ) : null}
      </AnimatePresence>
    </Box>
  );
});

Messages.propTypes = {
  users: PropTypes.object.isRequired,
};
