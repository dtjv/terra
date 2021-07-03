import * as React from 'react'
import { Flex, Grid } from '@chakra-ui/react'
import { useSchedule } from '@/hooks/use-schedule'
import { ScheduleColHeader } from '@/components/schedule-col-header'
import { ScheduleRowHeader } from '@/components/schedule-row-header'
import { ScheduleDataCell } from '@/components//schedule-data-cell'
import { MIN_ROW_HEIGHT, MIN_COL_WIDTH, CellKind } from '@/constants/constants'

export const Schedule: React.FC = () => {
  const { isLoading, isError, rows, error, updateTicketMutation, data } =
    useSchedule()

  const numRows = rows.length
  const numCols = rows[0]?.cells.length ?? 0
  const templateRows = `repeat(${numRows}, minmax(${MIN_ROW_HEIGHT}px, 1fr))`
  const templateCols = `repeat(${numCols}, minmax(${MIN_COL_WIDTH}px, 1fr))`

  if (isLoading) {
    return <div>render skeleton...</div>
  }

  if (isError) {
    return <div>{error?.message}</div>
  }

  return (
    <Flex p={8} align="center" justify="center">
      <Grid templateRows={templateRows} templateColumns={templateCols}>
        {rows.map((row) =>
          row.cells.map((cell) => {
            switch (cell.kind) {
              case CellKind.ROW_HEADER:
                return (
                  <ScheduleRowHeader
                    key={cell.key}
                    cell={cell}
                    numRows={numRows}
                    numCols={numCols}
                  />
                )
              case CellKind.COL_HEADER:
                return <ScheduleColHeader key={cell.key} cell={cell} />
              case CellKind.DATA_CELL:
                return (
                  <ScheduleDataCell
                    key={cell.key}
                    cell={cell}
                    rows={rows}
                    updateTicket={updateTicketMutation}
                    timeBlockInMinutes={data.scheduleConfig.timeBlockInMinutes}
                  />
                )
              default:
                return null
            }
          })
        )}
      </Grid>
    </Flex>
  )
}
