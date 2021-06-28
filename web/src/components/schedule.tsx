import * as React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { Flex, Grid } from '@chakra-ui/react'

import { CellKind } from '@/types/types'
import { ScheduleColHeader } from '@/components/schedule-col-header'
import { ScheduleRowHeader } from '@/components/schedule-row-header'
import { ScheduleCell } from '@/components//schedule-cell'

import type { Cell, ScheduleMatrix } from '@/types/types'

const COL_WIDTH = '100px'
const ROW_HEIGHT = '60px'

const useTickets = () => {
  return useQuery<ScheduleMatrix, Error>(
    ['tickets'],
    async () => {
      return (await axios.get('/api/schedule/')).data
    },
    {
      refetchInterval: 1000 * 60,
      refetchIntervalInBackground: true,
    }
  )
}

export const Schedule: React.FC = () => {
  const { data, isLoading } = useTickets()
  const cells: Cell[][] = data?.cells ?? []
  const numRows = cells.length
  const numCols = cells[0]?.length ?? 0
  const templateRows = `repeat(${numRows}, minmax(${ROW_HEIGHT}, 1fr))`
  const templateCols = `repeat(${numCols}, minmax(${COL_WIDTH}, 1fr))`

  if (isLoading) {
    return <div>render skeleton...</div>
  }

  return (
    <Flex p={8} align="center" justify="center">
      <Grid templateRows={templateRows} templateColumns={templateCols}>
        {cells.map((row) => {
          return row.map((cell) => {
            const key = `${cell.rowIdx}-${cell.colIdx}`

            switch (cell.data.kind) {
              case CellKind.COL_HEADER:
                return <ScheduleColHeader key={key} cell={cell} />
              case CellKind.ROW_HEADER:
                return (
                  <ScheduleRowHeader
                    key={key}
                    cell={cell}
                    numRows={numRows}
                    numCols={numCols}
                  />
                )
              case CellKind.DATA_CELL:
                return data ? (
                  <ScheduleCell key={key} cell={cell} matrix={data} />
                ) : null
              default:
                return null
            }
          })
        })}
      </Grid>
    </Flex>
  )
}
