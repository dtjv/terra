import { Box, Flex } from "@chakra-ui/react";

export const Ticket = ({ ticket, timeInterval }) => {
  const height = (ticket.duration / timeInterval) * 50 - 5;

  return (
    <Box
      position="absolute"
      bg="papayawhip"
      w="85%"
      h={`${height}px`}
      color="gray.900"
      borderRadius="4px"
      zIndex="10"
    >
      <Flex align="center">{ticket.id}</Flex>
    </Box>
  );
};
