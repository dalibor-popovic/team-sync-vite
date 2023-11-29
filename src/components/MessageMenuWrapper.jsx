import {
  Avatar,
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../store';

export const MessageMenuWrapper = ({
  children,
  users,
  seen,
  isSender,
  likeMessage,
  copyText,
  like,
  unlikeMessage,
  replyToMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const chat = useStore((state) => state.selectedChat);

  const { user } = useAuth();

  const isLiked = like?.includes(user.uid) ?? false;

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  return (
    <Menu
      isLazy
      strategy='fixed'
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      bg='transparent'
    >
      <MenuButton
        as={Box}
        cursor={isLargerThan800 ? 'text' : 'context-menu'}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        {children}
      </MenuButton>
      <Portal>
        <MenuList
          minWidth='36'
          mt='-2'
          backdropFilter='blur(10px)'
          bg='rgba( 255, 255, 255, 0.6 )'
        >
          <MenuItem onClick={replyToMessage} py='0.5' bg='transparent'>
            <Icon mr='3'>
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
                  d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
                />
              </svg>
            </Icon>
            <Text fontSize='sm'>Replay</Text>
          </MenuItem>
          <MenuItem
            onClick={() => (isLiked ? unlikeMessage() : likeMessage())}
            py='0.5'
            bg='transparent'
          >
            <Icon mr='3'>
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
                  d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                />
              </svg>
            </Icon>
            <Text fontSize='sm'>{isLiked ? 'Unlike' : 'Like'}</Text>
          </MenuItem>
          <MenuItem onClick={() => copyText()} py='0.5' bg='transparent'>
            <Icon mr='3'>
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
                  d='M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6'
                />
              </svg>
            </Icon>
            <Text fontSize='sm'>Copy</Text>
          </MenuItem>
          {isSender && chat.isGroupChat && seen?.length > 0 ? (
            <>
              <MenuDivider />
              <MenuGroup title='Seen'>
                {seen?.map((userId) => (
                  <MenuItem key={userId} py='0.5' as='div' bg='transparent'>
                    <Avatar
                      size='2xs'
                      name={users[userId]?.name}
                      src={users[userId]?.url}
                      mr='2'
                    />
                    <Text>{users[userId]?.name}</Text>
                  </MenuItem>
                ))}
              </MenuGroup>
            </>
          ) : null}
          {like?.length > 0 ? (
            <>
              <MenuDivider />
              <MenuGroup title='Likes'>
                {like?.map((userId) => (
                  <MenuItem key={userId} py='0.5' as='div' bg='transparent'>
                    <Avatar
                      size='2xs'
                      name={users[userId]?.name}
                      src={users[userId]?.url}
                      mr='2'
                    />
                    <Text>{users[userId]?.name}</Text>
                    <Icon color='red' boxSize='4' ml='1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-6 h-6'
                      >
                        <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
                      </svg>
                    </Icon>
                  </MenuItem>
                ))}
              </MenuGroup>
            </>
          ) : null}
        </MenuList>
      </Portal>
    </Menu>
  );
};

MessageMenuWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  users: PropTypes.object.isRequired,
  seen: PropTypes.array.isRequired,
  isSender: PropTypes.bool.isRequired,
  likeMessage: PropTypes.func.isRequired,
  unlikeMessage: PropTypes.func.isRequired,
  replyToMessage: PropTypes.func.isRequired,
  copyText: PropTypes.func.isRequired,
  like: PropTypes.array,
};
