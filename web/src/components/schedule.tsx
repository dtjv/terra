import * as React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { Flex, Grid } from '@chakra-ui/react'

import { ScheduleColHeader } from '@/components/schedule-col-header'
import { ScheduleRowHeader } from '@/components/schedule-row-header'
import { ScheduleCell } from '@/components//schedule-cell'

import type { Cell, ScheduleMatrix, ColHeader, RowHeader } from '@/types/types'

// TODO: where do i put these? should they be configurable?
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
  // TODO: do i need `isFetching`?
  const { data, isLoading } = useTickets()
  const cells: Cell[][] = data?.cells ?? []
  const rowHeaders = data?.rowHeaders ?? []
  const colHeaders = data?.colHeaders ?? []
  const numRows = rowHeaders.length + 1
  const numCols = colHeaders.length
  const templateRows = `repeat(${numRows}, minmax(${ROW_HEIGHT}, 1fr))`
  const templateCols = `repeat(${numCols}, minmax(${COL_WIDTH}, 1fr))`

  if (isLoading) {
    return <div>render skeleton...</div>
  }

  return (
    <Flex p={8} align="center" justify="center">
      <Grid templateRows={templateRows} templateColumns={templateCols}>
        {colHeaders.map((colHeader: ColHeader, colIdx) => (
          <ScheduleColHeader key={`col-${colIdx}`} header={colHeader} />
        ))}
        {data
          ? rowHeaders.map((rowHeader: RowHeader, rowIdx) => {
              const row = [rowHeader, ...(cells[rowIdx] ?? [])]

              return row.map((item, colIdx) => {
                const key = `${rowIdx}-${colIdx}`

                return colIdx === 0 ? (
                  <ScheduleRowHeader
                    key={key}
                    header={item as RowHeader}
                    rowIdx={rowIdx}
                    colIdx={colIdx}
                    numRows={numRows}
                    numCols={numCols}
                  />
                ) : (
                  <ScheduleCell key={key} cell={item as Cell} matrix={data} />
                )
              })
            })
          : null}
      </Grid>
    </Flex>
  )
}
