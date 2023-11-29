import { useEffect, useState } from 'react';
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  where,
} from 'firebase/firestore';
import { db, timestamp } from '../firebase';
import {
  Avatar,
  Flex,
  Text,
  Box,
  Input,
  Wrap,
  Tag,
  TagLabel,
  TagCloseButton,
  Checkbox,
  FormControl,
  FormLabel,
  Switch,
  Spinner,
  Button,
  Divider,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const Users = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isGroupChat, setGroupChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [chatName, setChatName] = useState('');
  const [search, setSearch] = useState('');

  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const docRef = collection(db, 'users');
    const getItems = async () => {
      const usersRes = await getDocs(
        query(docRef, where('id', '!=', user.uid))
      );
      if (!usersRes.empty) {
        const data = usersRes.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        setUsers(data);
      }
    };
    getItems();
    setLoading(false);
  }, [user.uid]);

  const createChat = async (selectedUserId) => {
    const chatId =
      user.uid > selectedUserId
        ? user.uid + selectedUserId
        : selectedUserId + user.uid;

    const res = await getDoc(doc(db, 'chats', chatId));

    if (!res.exists()) {
      await setDoc(doc(db, 'chats', chatId), {
        members: [user.uid, selectedUserId],
        updatedAt: timestamp,
        adminId: user.uid,
      });
      navigate(chatId);
      onClose();
    } else {
      navigate(res.id);
      onClose();
    }
  };

  const createGroupChat = async () => {
    const name = chatName.trim();

    if (name.length === 0) return;

    const members = selectedUsers.map((u) => u.id);

    const newChat = await addDoc(collection(db, 'chats'), {
      members: [user.uid, ...members],
      adminId: user.uid,
      updatedAt: timestamp,
      name,
    });

    navigate(newChat.id);
    onClose();
  };

  const isGroupChatHandler = (e) => {
    setGroupChat(e.target.checked);

    if (!e.target.checked) setSelectedUsers([]);
  };

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <Box minH='240px' display='grid' placeItems='center'>
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      <Box mb='2'>
        <Flex mb='2'>
          <FormControl display='flex' alignItems='baseline' w='fit-content'>
            <Switch
              isChecked={isGroupChat}
              onChange={isGroupChatHandler}
              id='group-chat'
              colorScheme='twitter'
              size='sm'
            />
            <FormLabel cursor='pointer' htmlFor='group-chat' mb='0' ml='2'>
              Group chat
            </FormLabel>
          </FormControl>
          {isGroupChat ? (
            <Text ml='auto' fontSize='2xs'>
              Members ({selectedUsers.length})
            </Text>
          ) : null}
        </Flex>
        {isGroupChat ? (
          <Input
            placeholder='Enter chat name'
            colorScheme='twitter'
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        ) : null}

        {selectedUsers.length > 0 ? (
          <>
            <Button
              variant='solid'
              colorScheme='twitter'
              size='sm'
              rounded='lg'
              mt='2'
              w='full'
              onClick={createGroupChat}
            >
              Create
            </Button>
            <Divider w='full' py='1' />
            <Text fontSize='xs'>Selected users</Text>
            <Wrap my='2'>
              {selectedUsers.map((selectedUser) => (
                <Tag
                  key={selectedUser.id}
                  size='lg'
                  colorScheme='twitter'
                  borderRadius='full'
                >
                  <Avatar
                    src={selectedUser.url}
                    size='xs'
                    name={selectedUser.name}
                    ml={-1}
                    mr={2}
                  />
                  <TagLabel>{selectedUser.name}</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      setSelectedUsers((prevState) =>
                        prevState.filter((u) => u.id !== selectedUser.id)
                      )
                    }
                  />
                </Tag>
              ))}
            </Wrap>
          </>
        ) : null}
      </Box>
      <Box>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search...'
          colorScheme='twitter'
        />
      </Box>
      {filteredUsers.map((user) => (
        <Flex
          onClick={
            isGroupChat
              ? () =>
                  setSelectedUsers((prevState) =>
                    prevState.some((u) => u.id === user.id)
                      ? prevState.filter((us) => us.id !== user.id)
                      : [...prevState, { ...user }]
                  )
              : () => createChat(user.id)
          }
          key={user.id}
          alignItems='center'
          mt='2'
          px='2'
          py='1'
          cursor='pointer'
          rounded='md'
          borderWidth='1px'
          borderStyle='dashed'
          borderColor='transparent'
          _hover={{ borderColor: 'blackAlpha.600' }}
        >
          <Avatar src={user.url} name={user.name} />
          <Text ml='4'>{user.name}</Text>
          {isGroupChat ? (
            <Checkbox
              colorScheme='twitter'
              ml='auto'
              zIndex='-1'
              isChecked={selectedUsers.some((su) => su.id === user.id)}
            />
          ) : null}
        </Flex>
      ))}
    </>
  );
};

Users.propTypes = {
  onClose: PropTypes.func,
};
