import { Box, Flex, Icon, Text, chakra } from '@chakra-ui/react';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, timestamp } from '../firebase';
import { useOnScreen } from '../hooks/useOnScreen';
import { useStore } from '../store';
import { MessageMenuWrapper } from './MessageMenuWrapper';

export const Message = ({
  isSender,
  text,
  time,
  seen,
  chatId,
  id,
  messageUserId,
  users,
  like,
  replyMessage,
}) => {
  const ref = useRef();
  const emojiRef = useRef();
  const visible = useOnScreen(ref);
  const visibleEmoji = useOnScreen(emojiRef);

  const { user } = useAuth();

  const state = useStore((state) => state);

  useEffect(() => {
    if (isSender) return;
    if (seen?.includes(user.uid)) return;
    if (!visible && !visibleEmoji) return;
    if (!chatId || !id) return;
    if (messageUserId == user.uid) return;

    const updateMsg = async () => {
      await updateDoc(doc(db, 'chats', chatId, 'messages', id), {
        seen: arrayUnion(user.uid),
      });
      await updateDoc(doc(db, 'chats', chatId), {
        'lastMessage.seen': arrayUnion(user.uid),
      });
    };
    updateMsg();
  }, [
    seen,
    visible,
    visibleEmoji,
    chatId,
    id,
    isSender,
    messageUserId,
    user.uid,
  ]);

  const replyToMessage = () => {
    state.setReplyMessage({
      id,
      text,
      messageUserName: users[messageUserId]?.name,
    });
  };

  const likeMessage = async () => {
    await updateDoc(doc(db, 'chats', chatId, 'messages', id), {
      like: arrayUnion(user.uid),
    });
  };

  const unlikeMessage = async () => {
    await updateDoc(doc(db, 'chats', chatId, 'messages', id), {
      like: arrayRemove(user.uid),
    });
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
  };

  const scrollIntoView = () => {
    if (!replyMessage.id) return;
    const messageDomDoc = document.getElementById(replyMessage.id);
    messageDomDoc.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    setTimeout(() => {
      messageDomDoc.classList.add('shake');
    }, [500]);
    setTimeout(() => {
      messageDomDoc.classList.remove('shake');
    }, [1000]);
  };

  const removeEmojis = (string) => {
    const regex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

    return string.replace(regex, '');
  };

  const isEmojisOnly = (string) => removeEmojis(string).length === 0;

  if (isEmojisOnly(text)) {
    return (
      <Box ml={isSender ? 'auto' : ''} id={id}>
        <MessageMenuWrapper
          users={users}
          seen={seen ?? []}
          like={like ?? []}
          isSender={isSender}
          likeMessage={likeMessage}
          unlikeMessage={unlikeMessage}
          copyText={copyText}
          replyToMessage={replyToMessage}
        >
          <Text fontSize='2.25rem' position='relative' ref={emojiRef}>
            {text}
            <chakra.span position='absolute' right='0' bottom='-3'>
              {like.length > 0 ? (
                <Icon ml='auto' color='red' boxSize='3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-6 h-6'
                  >
                    <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
                  </svg>
                </Icon>
              ) : null}
              {like.length > 1 ? (
                <Text ml='0.5' fontSize='2xs'>
                  {like.length}
                </Text>
              ) : null}
            </chakra.span>
          </Text>
        </MessageMenuWrapper>
      </Box>
    );
  }

  return (
    <Box
      w='fit-content'
      maxW='320px'
      margin='1'
      ml={isSender ? 'auto' : '0'}
      ref={ref}
      id={id}
    >
      <Flex alignItems='center' mb='1'>
        <Text fontWeight='500' fontSize='xs' px='1'>
          {users[messageUserId]?.name}
        </Text>
        <Text ml='1' fontSize='2xs' textColor={'blackAlpha.600'}>
          {time}
        </Text>
        {like.length > 0 ? (
          <Icon ml='auto' color='red' boxSize='3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
            </svg>
          </Icon>
        ) : null}
        {like.length > 1 ? (
          <Text ml='0.5' fontSize='2xs'>
            {like.length}
          </Text>
        ) : null}
      </Flex>
      <Box
        w='full'
        display='flex'
        flexDir='column'
        bg={isSender ? 'twitter.400' : 'white'}
        boxShadow='md'
        borderTopRightRadius={isSender ? 0 : 'xl'}
        borderBottomLeftRadius='xl'
        borderTopLeftRadius={isSender ? 'xl' : 0}
        borderBottomRightRadius='xl'
      >
        {replyMessage ? (
          <Box role='button' onClick={scrollIntoView}>
            <Box
              color={isSender ? 'white' : 'black'}
              bg={isSender ? 'whiteAlpha.300' : 'blackAlpha.50'}
              rounded='lg'
              mx='2'
              mt='2'
              position='relative'
              px='3'
              py='1'
              sx={{
                '::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  borderRadius: 'xl',
                  bg: 'twitter.800',
                  overflow: 'hidden',
                },
              }}
            >
              <Text
                fontSize='2xs'
                fontWeight='bold'
                color='twitter.800'
                h='16px'
              >
                {users[replyMessage.userId]?.name}
              </Text>
              <Text noOfLines={1} fontSize='xs'>
                {replyMessage.text}
              </Text>
            </Box>
          </Box>
        ) : null}
        <MessageMenuWrapper
          users={users}
          seen={seen ?? []}
          like={like ?? []}
          isSender={isSender}
          likeMessage={likeMessage}
          unlikeMessage={unlikeMessage}
          copyText={copyText}
          replyToMessage={replyToMessage}
        >
          <>
            <Box py='1.5' pl='4' pr='2' color={isSender ? 'white' : 'black'}>
              <Flex alignItems='flex-end'>
                <Text mr='8' textColor={isSender ? 'white' : 'blackAlpha.900'}>
                  {text}
                </Text>
                {isSender && seen?.length > 0 ? (
                  <>
                    <Icon>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2.5}
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M4.5 12.75l6 6 9-13.5'
                        />
                      </svg>
                    </Icon>
                    <Icon ml='-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2.5}
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M4.5 12.75l6 6 9-13.5'
                        />
                      </svg>
                    </Icon>
                  </>
                ) : null}
              </Flex>
            </Box>
          </>
        </MessageMenuWrapper>
      </Box>
    </Box>
  );
};

Message.propTypes = {
  isSender: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  seen: PropTypes.array.isRequired,
  chatId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  messageUserId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  like: PropTypes.array.isRequired,
  replyMessage: PropTypes.object,
};
