import * as React from 'react'
import { Flex, GridItem } from '@chakra-ui/react'

import { CellKind } from '@/types/types'
import type { Cell } from '@/types/types'

export interface ScheduleColHeaderProps {
  cell: Cell
}

export const ScheduleColHeader: React.FC<ScheduleColHeaderProps> = ({
  cell,
}) => {
  if (cell.data.kind !== CellKind.COL_HEADER) return null

  return (
    <GridItem borderBottomWidth="1px" borderBottomColor="gray.600">
      <Flex align="center" justify="center">
        {cell.data.display}
      </Flex>
    </GridItem>
  )
}
