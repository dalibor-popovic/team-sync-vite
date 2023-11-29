import { Box, Text, IconButton, Icon } from '@chakra-ui/react';
import { useStore } from '../store';
import PropTypes from 'prop-types';

export const ReplyMessagePreview = ({ discardReply }) => {
  const state = useStore((state) => state);
  return (
    <Box
      bg='blackAlpha.50'
      rounded='xl'
      mx='5'
      mt='4'
      position='relative'
      px='4'
      py='2'
      sx={{
        '::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '6px',
          borderRadius: 'xl',
          bg: 'twitter.800',
          overflow: 'hidden',
        },
      }}
    >
      <Text fontSize='2xs' fontWeight='bold' color='twitter.800'>
        {state.replyMessage.messageUserName}
      </Text>
      <Text fontSize='xs'>{state.replyMessage.text}</Text>
      <Box position='absolute' right='0' top='0' px='1'>
        <IconButton
          size='xs'
          rounded='full'
          onClick={discardReply}
          icon={
            <Icon>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='w-5 h-5'
              >
                <path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
              </svg>
            </Icon>
          }
        />
      </Box>
    </Box>
  );
};

ReplyMessagePreview.propTypes = {
  discardReply: PropTypes.func,
};
