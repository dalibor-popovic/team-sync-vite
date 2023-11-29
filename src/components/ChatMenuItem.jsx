import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { useStore } from '../store';

export const ChatMenuItem = (props) => {
  const { chatMembers, setSelectedChat, selectedChat, setChatMembers } =
    useStore((state) => state);

  const { chatId, userId, lastMessage, isSelected } = props;

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
        isGroupChat: false,
        uid: userId,
        uids: [],
        name: '',
      });
    }
  }, [id]);

  useEffect(() => {
    const docRef = doc(db, 'users', userId);
    const get = async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setChatMembers({ chatId, members: [docSnap.data()] });
      }
    };
    get();
  }, [chatId, id]);

  const onSelectChat = () => {
    setSelectedChat({
      id: chatId,
      isGroupChat: false,
      uid: userId,
      uids: [],
      name: '',
    });
    navigate(chatId);
  };

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
      <Avatar
        name={chatMembers[chatId] ? chatMembers[chatId][0]?.name : undefined}
        src={chatMembers[chatId] ? chatMembers[chatId][0]?.url : undefined}
        size='sm'
        h='2.5rem'
        w='2.5rem'
      />
      <Box ml='4' w='full'>
        <Flex>
          <Text
            noOfLines={1}
            fontWeight={chatId !== id && unread() ? 'bold' : 'normal'}
          >
            {chatMembers[chatId] ? chatMembers[chatId][0]?.name : null}
          </Text>
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

ChatMenuItem.propTypes = {
  chatId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  lastMessage: PropTypes.object,
  isSelected: PropTypes.bool.isRequired,
};
