import { Box, Flex } from "@chakra-ui/react";

export const RowHeader = ({ children }) => {
  return (
    <Box position="absolute" bg="gray.800" top="-.84rem" right="1rem" w="100%">
      <Flex direction="column" align="flex-end" mr="10px">
        {children}
      </Flex>
    </Box>
  );
};
