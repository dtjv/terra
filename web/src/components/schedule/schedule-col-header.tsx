import { Flex, Text } from '@chakra-ui/react'
import { CellKind } from '@/types/enums'
import type { Cell } from '@/types/types'

export interface ScheduleColHeaderProps {
  cell: Cell
}

export const ScheduleColHeader = ({ cell }: ScheduleColHeaderProps) => {
  if (cell.kind !== CellKind.COL_HEADER) {
    return null
  }

  if (cell.colIdx === 0) {
    return <Flex height="40px"></Flex>
  }

  return (
    <Flex height="40px" align="center" justify="center">
      <Text fontSize="md" fontWeight="semibold">
        {cell.display}
      </Text>
    </Flex>
  )
}
