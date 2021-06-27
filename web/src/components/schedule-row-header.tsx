import * as React from 'react'
import { Box, Flex } from '@chakra-ui/react'

export const ScheduleRowHeader: React.FC = ({ children, ...props }) => {
  return (
    <Box position="absolute" bg="gray.800" top="-.84rem" right="1rem" w="100%">
      <Flex {...props} direction="column" align="flex-end" mr="10px">
        {children}
      </Flex>
    </Box>
  )
}
