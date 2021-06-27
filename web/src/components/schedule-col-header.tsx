import * as React from 'react'
import { Flex } from '@chakra-ui/react'

export const ScheduleColHeader: React.FC = ({ children, ...props }) => {
  return (
    <Flex {...props} align="center" justify="center">
      {children}
    </Flex>
  )
}
