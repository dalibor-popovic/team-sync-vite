import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ChatHeader = ({ users, name }) => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  return (
    <Box
      h='64px'
      py='2'
      px='4'
      display='flex'
      alignItems='center'
      bg='white'
      position='sticky'
      top='0'
      left='0'
      right='0'
    >
      <Flex w='full'>
        {!isLargerThan800 ? (
          <IconButton
            size='sm'
            mr='1'
            variant='ghost'
            rounded='full'
            textColor='blackAlpha.700'
            icon={
              <Icon boxSize={5}>
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
                    d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
                  />
                </svg>
              </Icon>
            }
            onClick={() => navigate('/', { replace: true })}
          />
        ) : null}
        {users.length > 2 ? (
          <Box>
            <Heading size='md'>{name}</Heading>
            <Popover placement='bottom-start'>
              <PopoverTrigger>
                <Text
                  w='fit-content'
                  cursor='pointer'
                  fontSize='xs'
                  color='blackAlpha.600'
                >
                  Members
                </Text>
              </PopoverTrigger>
              <PopoverContent
                minWidth='unset'
                width='unset'
                _focus={{ boxShadow: 'none' }}
              >
                <PopoverBody>
                  {users.map((user, i) => (
                    <Flex
                      key={user.id}
                      alignItems='center'
                      mt={i > 0 ? '2' : '0'}
                    >
                      <Avatar
                        size='sm'
                        name={user.name}
                        src={user.url}
                        mr='2'
                      />
                      <Heading size='sm' fontWeight='600'>
                        {user.name}
                      </Heading>
                    </Flex>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        ) : (
          users.map(
            (u) =>
              u.id !== user.uid && (
                <Flex key={u.id} alignItems='center' mr='2'>
                  <Avatar size='sm' name={u.name} src={u.url} mr='2' />
                  <Heading size='sm' fontWeight='600'>
                    {u.name}
                  </Heading>
                </Flex>
              )
          )
        )}
      </Flex>
    </Box>
  );
};

ChatHeader.propTypes = {
  users: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  adminId: PropTypes.string,
};
