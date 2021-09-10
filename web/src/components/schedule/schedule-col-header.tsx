import { VStack, Flex, Text, Icon } from '@chakra-ui/react'
import { GiMineTruck } from 'react-icons/gi'
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
    <VStack height="full" spacing={0}>
      <Icon as={GiMineTruck} boxSize={16} color="gray.500" />
      <Text fontSize="md" fontWeight="semibold">
        {cell.display}
      </Text>
    </VStack>
  )
}
