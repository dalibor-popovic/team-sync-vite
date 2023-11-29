import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useStore } from '../store';

const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '40vw', md: '40vw', lg: '30vw' })}
      zIndex='-1'
      opacity='0.4'
      height='560px'
      viewBox='0 0 528 560'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle cx='71' cy='61' r='111' fill='#F56565' />
      <circle cx='244' cy='106' r='139' fill='#ED64A6' />
      <circle cy='291' r='139' fill='#ED64A6' />
      <circle cx='80.5' cy='189.5' r='101.5' fill='#ED8936' />
      <circle cx='196.5' cy='317.5' r='101.5' fill='#ECC94B' />
      <circle cx='70.5' cy='458.5' r='101.5' fill='#48BB78' />
      <circle cx='426.5' cy='-0.5' r='101.5' fill='#4299E1' />
    </Icon>
  );
};

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const store = useStore((state) => state);

  const { signIn } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    signIn(email, password)
      .then((res) => {
        getDoc(doc(db, 'users', res.user.uid)).then((userDetails) => {
          if (userDetails.exists()) {
            store.setUserDetails({ ...userDetails.data() });
          }
        });

        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box position={'relative'}>
      <Container
        as={SimpleGrid}
        maxW={'7xl'}
        columns={{ base: 1, md: 1 }}
        spacing='10'
        py={{ base: 10, sm: 20, lg: 32 }}
        placeItems='center'
      >
        <Flex>
          <Heading lineHeight={1.1} fontSize='6xl'>
            <Text
              as='span'
              bgGradient='linear(to-r, twitter.400,twitter.500)'
              bgClip='text'
            >
              Teamsync
            </Text>
          </Heading>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            p='2'
            ml='2'
            h='fit-content'
            color='white'
            rounded='xl'
            bgGradient='linear(to-r, red.300, pink.400)'
          >
            <Icon lineHeight={1.1} fontSize='4xl'>
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
                  d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155'
                />
              </svg>
            </Icon>
          </Box>
        </Flex>
        <Stack
          borderStyle='dashed'
          borderWidth='1px'
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          w='sm'
        >
          <Stack spacing={4}>
            <Heading color={'gray.800'} lineHeight={1.1} fontSize='xl'>
              Login
            </Heading>
          </Stack>
          <Box as={'form'} onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                colorScheme='twitter'
              />
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                colorScheme='twitter'
              />
            </Stack>
            <Button
              isLoading={loading}
              fontFamily={'heading'}
              type='submit'
              mt={8}
              w={'full'}
              bgGradient='linear(to-r, twitter.400,twitter.300)'
              color={'white'}
              _hover={{
                bgGradient: 'linear(to-r, twitter.300,twitter.400)',
                boxShadow: 'lg',
              }}
            >
              Login
            </Button>
          </Box>
        </Stack>
        <Box textColor='gray.600'>
          <Flex gap='2'>
            <Text>User:</Text>
            <Text>test@teamsync.com</Text>
          </Flex>
          <Flex gap='2'>
            <Text>Pass:</Text>
            <Text>test123</Text>
          </Flex>
        </Box>
      </Container>
      <Blur
        position={'absolute'}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
    </Box>
  );
};
