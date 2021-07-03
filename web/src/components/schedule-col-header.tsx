import * as React from 'react'
import { Flex, GridItem } from '@chakra-ui/react'
import type { Cell } from '@/types/types'
import { CellKind } from '@/constants/constants'

export type ScheduleColHeaderProps = { cell: Cell }

export const ScheduleColHeader: React.FC<ScheduleColHeaderProps> = ({
  cell,
}) => {
  if (cell.kind !== CellKind.COL_HEADER) return null

  return (
    <GridItem borderBottomWidth="1px" borderBottomColor="gray.600">
      <Flex align="center" justify="center">
        {cell.display}
      </Flex>
    </GridItem>
  )
}
