import { Flex, GridItem } from '@chakra-ui/react'
import { CellKind } from '@/types/enums'
import type { Cell } from '@/types/types'

export interface ScheduleColHeaderProps {
  cell: Cell
}

export const ScheduleColHeader = ({ cell }: ScheduleColHeaderProps) => {
  if (cell.kind !== CellKind.COL_HEADER) return null

  return (
    <GridItem borderBottomWidth="1px" borderBottomColor="gray.600">
      <Flex align="center" justify="center">
        {cell.display}
      </Flex>
    </GridItem>
  )
}
