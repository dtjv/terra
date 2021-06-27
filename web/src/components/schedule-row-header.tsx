import * as React from 'react'
import { Box, Flex, GridItem } from '@chakra-ui/react'

import type { RowHeader } from '@/types/types'

export interface ScheduleRowHeaderProps {
  header: RowHeader
  rowIdx: number
  colIdx: number
  numRows: number
  numCols: number
}

export const ScheduleRowHeader: React.FC<ScheduleRowHeaderProps> = ({
  header,
  rowIdx,
  colIdx,
  numRows,
  numCols,
}) => {
  const height = header.display ? 'auto' : '4'

  return (
    <GridItem
      position="relative"
      borderRightWidth="1px"
      borderRightColor="gray.600"
      sx={{
        position: 'relative',
        ...(rowIdx % 2 !== 0 && rowIdx < numRows - 2
          ? {
              borderBottomWidth: '1px',
              borderBottomColor: 'gray.600',
            }
          : {}),
        ...(colIdx < numCols - 1
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
        <Flex height={height} direction="column" align="flex-end" mr="10px">
          {header.display}
        </Flex>
      </Box>
    </GridItem>
  )
}
