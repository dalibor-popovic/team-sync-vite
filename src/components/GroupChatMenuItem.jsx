import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { useStore } from '../store';

export const GroupChatMenuItem = (props) => {
  const { chatMembers, setSelectedChat, selectedChat, setChatMembers } =
    useStore((state) => state);

  const { chatId, usersIds, lastMessage, isSelected, name, adminId } = props;

  const { user } = useAuth();

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setSelectedChat({
        id: '',
        isGroupChat: false,
        uid: '',
        uids: [],
        name: '',
        adminId: '',
      });
    } else {
      if (chatId !== id) return;
      if (selectedChat.id === id) return;

      setSelectedChat({
        id,
        isGroupChat: true,
        uid: '',
        uids: usersIds,
        name,
        adminId,
      });
    }
  }, [id]);

  useEffect(() => {
    const docRef = collection(db, 'users');
    const get = async () => {
      const usersRes = await getDocs(
        query(docRef, where(documentId(), 'in', usersIds))
      );

      if (!usersRes.empty) {
        const data = usersRes.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        setChatMembers({ chatId, members: data });
      }
    };
    get();
  }, [chatId, id]);

  const onSelectChat = () => {
    setSelectedChat({
      id: chatId,
      isGroupChat: true,
      uid: '',
      uids: usersIds,
      name,
      adminId,
    });
    navigate(chatId);
  };

  const users = chatMembers[chatId]?.map((user) => user.name).join(', ');

  const unread = () => {
    if (!lastMessage) return false;

    if (lastMessage.userId === user.uid) return false;

    return lastMessage.seen.length === 0;
  };

  return (
    <Flex
      borderColor={isSelected ? 'blackAlpha.400' : 'transparent'}
      _hover={{ borderColor: 'blackAlpha.600' }}
      borderWidth='1px'
      borderStyle='dashed'
      rounded='xl'
      py='1'
      px='2'
      cursor='pointer'
      alignItems='center'
      onClick={onSelectChat}
    >
      <AvatarGroup size='sm' max={2}>
        {chatMembers[chatId]?.map((user) => (
          <Avatar
            key={user.id}
            name={user.name}
            src={user.url}
            h='2.5rem'
            w='2.5rem'
          />
        ))}
      </AvatarGroup>
      <Box ml='2' w='full'>
        <Flex>
          <Tooltip placement='top-end' label={users} aria-label='users'>
            <Text
              fontWeight={chatId !== id && unread() ? 'bold' : 'normal'}
              noOfLines={1}
            >
              {name}
            </Text>
          </Tooltip>
          {lastMessage &&
          lastMessage.seen?.length > 0 &&
          lastMessage.userId === user.uid ? (
            <Text color='blackAlpha.600' fontSize='2xs' ml='auto'>
              seen
            </Text>
          ) : null}
        </Flex>
        <Flex alignItems='center' mt='-1'>
          <Text
            fontSize='sm'
            noOfLines={1}
            fontWeight={chatId !== id && unread() ? 'bold' : 'normal'}
          >
            {lastMessage ? lastMessage.text : 'Drop first message'}
          </Text>
          <Text
            noOfLines={1}
            fontSize='2xs'
            ml='auto'
            color='blackAlpha.800'
            minW='56px'
          >
            {lastMessage &&
              lastMessage.createdAt &&
              new Date(lastMessage.createdAt.toMillis())?.toLocaleDateString()}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

GroupChatMenuItem.propTypes = {
  chatId: PropTypes.string.isRequired,
  usersIds: PropTypes.array.isRequired,
  lastMessage: PropTypes.object,
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.string,
  adminId: PropTypes.string,
};
