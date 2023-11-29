import { ChatMenuItems } from './ChatMenuItems';
import { Header } from './Header';
import { Footer } from './Footer';
import { Flex, useMediaQuery } from '@chakra-ui/react';

export const ChatMenu = () => {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  return (
    <Flex
      minW={isLargerThan800 ? '300px' : 'full'}
      maxW={isLargerThan800 ? '300px' : 'full'}
      position='fixed'
      top='0'
      bottom='0'
      left='0'
      overflow='hidden'
    >
      <Flex flexDir='column' p='2' w='full'>
        <Header />
        <ChatMenuItems />
        <Footer />
      </Flex>
    </Flex>
  );
};
