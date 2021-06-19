import { Box, Flex } from "@chakra-ui/react";

export const Ticket = ({ height, children }) => {
  return (
    <Box
      position="absolute"
      bg="papayawhip"
      w="85%"
      h={`${height}%`}
      color="gray.900"
      borderTopRightRadius="3px"
      borderBottomRightRadius="3px"
      borderBottomLeftRadius="3px"
    >
      <Flex align="center">{children}</Flex>
    </Box>
  );
};
