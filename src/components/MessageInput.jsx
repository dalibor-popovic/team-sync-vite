import { Box, Flex, IconButton, chakra, useMediaQuery } from '@chakra-ui/react';
import Picker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { timestamp, db } from '../firebase';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import { useStore } from '../store';
import { ReplyMessagePreview } from './ReplyMessagePreview';

export const MessageInput = ({ scrollToBottom }) => {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emojiContainerRef = useRef();
  const textAreaRef = useRef();
  const containerRef = useRef();

  const { user } = useAuth();
  const { id } = useParams();

  const state = useStore((state) => state);

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  useEffect(() => {
    textAreaRef.current.style.height = 'auto';
    containerRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    containerRef.current.style.height =
      textAreaRef.current.scrollHeight + 24 + 'px';
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target?.value;
    setValue(newValue);
  };

  const onEmojiClick = (emojiObject) => {
    setValue((prevInput) => prevInput + emojiObject.emoji);
    setIsModalOpen(false);
    textAreaRef.current.focus();
  };

  const sendMessage = async (e) => {
    const keyCode = e.which || e.keyCode;
    const isEnter = keyCode === 13;

    if (isEnter && !e.shiftKey) {
      e.preventDefault();

      if (!value.trim().length) return;

      setIsSending(true);

      const msgData = {
        text: value,
        createdAt: timestamp,
        userId: user.uid,
        like: [],
        seen: [],
        replyId: state.replyMessage ? state.replyMessage.id : '',
      };
      const messageRes = await addDoc(
        collection(db, `chats/${id}/messages`),
        msgData
      );

      await updateDoc(doc(db, 'chats', id), {
        updatedAt: timestamp,
        lastMessage: {
          id: messageRes.id,
          ...msgData,
        },
      });

      state.setReplyMessage(null);

      setValue('');
      scrollToBottom();
      setIsSending(false);
    }
  };

  const sendMessageOnClick = async (e) => {
    setIsSending(true);
    e.preventDefault();
    textAreaRef.current.focus();
    if (!value.trim().length) return;

    const msgData = {
      text: value,
      createdAt: timestamp,
      userId: user.uid,
      like: [],
      seen: [],
      replyId: state.replyMessage ? state.replyMessage.id : '',
    };

    const messageRes = await addDoc(
      collection(db, `chats/${id}/messages`),
      msgData
    );

    await updateDoc(doc(db, 'chats', id), {
      updatedAt: timestamp,
      lastMessage: {
        id: messageRes.id,
        ...msgData,
      },
    });

    state.setReplyMessage(null);

    setValue('');
    scrollToBottom();

    setIsSending(false);
  };

  const discardReply = () => {
    state.setReplyMessage(null);
    textAreaRef.current.focus();
  };

  return (
    <>
      {state.replyMessage ? (
        <>
          <ReplyMessagePreview discardReply={discardReply} />
          {textAreaRef.current.focus()}
        </>
      ) : null}
      <Flex
        mt='auto'
        minH='58px'
        ref={containerRef}
        border={isLargerThan800 ? '1px' : 0}
        m={isLargerThan800 ? 4 : 0}
        mb={isLargerThan800 ? 6 : 1}
        rounded={isLargerThan800 ? '3xl' : 0}
        borderColor='blackAlpha.300'
        bg='white'
        position='relative'
      >
        {isLargerThan800 ? (
          <Box h='fit-content' p='4' position='relative'>
            <IconButton
              size='xs'
              variant='unstyled'
              textColor='blackAlpha.700'
              onClick={() => {
                setIsModalOpen((prev) => !prev);
                textAreaRef.current.focus();
              }}
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z'
                  />
                </svg>
              }
            />

            {isModalOpen ? (
              <Box position='absolute' bottom='12' ref={emojiContainerRef}>
                <Picker onEmojiClick={onEmojiClick} />
              </Box>
            ) : null}
          </Box>
        ) : null}
        <Box position='relative' w='full' pl={isLargerThan800 ? '' : '4'}>
          <chakra.textarea
            h='auto'
            onChange={handleChange}
            value={value}
            rows={1}
            ref={textAreaRef}
            placeholder={
              state.replyMessage ? 'Replay to message' : 'Type a message..'
            }
            onKeyDown={isLargerThan800 ? sendMessage : undefined}
          />
        </Box>
        <Box h='fit-content' p='4'>
          <IconButton
            onClick={sendMessageOnClick}
            isDisabled={isSending}
            size='xs'
            variant='unstyled'
            textColor='twitter.600'
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                />
              </svg>
            }
          />
        </Box>
      </Flex>
    </>
  );
};

MessageInput.propTypes = {
  scrollToBottom: PropTypes.func,
};
