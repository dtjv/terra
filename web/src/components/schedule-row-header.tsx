import * as React from 'react'
import { Box, Flex, GridItem } from '@chakra-ui/react'
import type { Cell } from '@/types/types'
import { CellKind } from '@/constants/constants'

export type ScheduleRowHeaderProps = {
  cell: Cell
  numRows: number
  numCols: number
}

export const ScheduleRowHeader: React.FC<ScheduleRowHeaderProps> = ({
  cell,
  numRows,
  numCols,
}) => {
  if (cell.kind !== CellKind.ROW_HEADER) return null

  return (
    <GridItem
      position="relative"
      borderRightWidth="1px"
      borderRightColor="gray.600"
      sx={{
        ...(cell.rowIdx % 2 === 0 && cell.rowIdx < numRows - 1
          ? {
              borderBottomWidth: '1px',
              borderBottomColor: 'gray.600',
            }
          : {}),
        ...(cell.colIdx < numCols - 1
          ? {
              borderRightWidth: '1px',
              borderRightColor: 'gray.600',
            }
          : {}),
      }}
    >
      <Box
        position="absolute"
        bg="gray.800"
        top="-.84rem"
        right="1rem"
        w="100%"
      >
        <Flex
          height={cell.display ? 'auto' : '4'}
          direction="column"
          align="flex-end"
          mr="10px"
        >
          {cell.display}
        </Flex>
      </Box>
    </GridItem>
  )
}
