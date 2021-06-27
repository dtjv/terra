import * as React from 'react'
import { Flex, GridItem } from '@chakra-ui/react'

import type { ColHeader } from '@/types/types'

export interface ScheduleColHeaderProps {
  header: ColHeader
}

export const ScheduleColHeader: React.FC<ScheduleColHeaderProps> = ({
  header,
}) => {
  return (
    <GridItem borderBottomWidth="1px" borderBottomColor="gray.600">
      <Flex align="center" justify="center">
        {header.display}
      </Flex>
    </GridItem>
  )
}
