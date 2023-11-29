import { Route, Routes } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './pages/Login';
import { Chat } from './pages/Chat';
import { Home } from './pages/Home';
import { useMediaQuery } from '@chakra-ui/react';
import { ChatMenu } from './components/ChatMenu';

function App() {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  return (
    <Routes>
      <Route path='/auth/*' element={<AuthLayout />}>
        <Route path='login' element={<Login />} />
      </Route>
      <Route path='/*' element={<AppLayout />}>
        {isLargerThan800 ? (
          <Route index element={<Home />} />
        ) : (
          <Route index element={<ChatMenu />} />
        )}
        <Route path=':id' element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
