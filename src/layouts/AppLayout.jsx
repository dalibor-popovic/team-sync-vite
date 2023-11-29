import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ChatMenu } from '../components/ChatMenu';
import { Box, useMediaQuery } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

export const AppLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  return user ? (
    <Box overflow='hidden'>
      {isLargerThan800 ? <ChatMenu /> : null}
      <Box
        className='full-height'
        position='fixed'
        left={isLargerThan800 ? '300px' : '0'}
        top='0'
        right='0'
        bottom='0'
        display='flex'
        flexDir='column'
      >
        <Outlet />
      </Box>
    </Box>
  ) : (
    <Navigate to='/auth/login' state={{ from: location }} replace />
  );
};
