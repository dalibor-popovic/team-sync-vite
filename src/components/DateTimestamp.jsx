import { Box, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export const DateTimestamp = ({ date }) => {
  return (
    <Box w='fit-content' bg='white' ml='auto' mr='auto'>
      <Text textColor='blackAlpha.400' fontSize='xs'>
        {date}
      </Text>
    </Box>
  );
};

DateTimestamp.propTypes = {
  date: PropTypes.string,
};
