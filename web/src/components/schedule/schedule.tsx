import { useState } from 'react'
import { set } from 'date-fns'
import {
  Grid,
  GridItem,
  SimpleGrid,
  Box,
  Spacer,
  Flex,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react'
import { useSchedule } from '@/hooks/use-schedule'
import {
  ScheduleNav,
  ScheduleToolbar,
  ScheduleColHeader,
  ScheduleRowHeader,
  ScheduleDataCell,
} from '@/components/schedule'
import { CellKind } from '@/types/enums'
import {
  SCHEDULE_ROW_N_MIN_HEIGHT,
  SCHEDULE_COL_0_WIDTH,
  SCHEDULE_COL_N_MIN_WIDTH,
} from '@/config'
import type { Vehicle } from '@/types/types'

interface ScheduleProps {
  vehicles: Vehicle[]
}

export const Schedule = ({ vehicles }: ScheduleProps) => {
  const [scheduledAt, setScheduledAt] = useState(
    set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
  )
  const { rows, data, error, isLoading, isError, updateTicketMutation } =
    useSchedule({ vehicles, scheduledAt })
  const numRows = rows.length + 1
  const numCols = rows[0]?.cells.length ?? 0
  const templateRows = `repeat(${numRows}, minmax(${SCHEDULE_ROW_N_MIN_HEIGHT}px, 1fr))`
  const templateCols = `${SCHEDULE_COL_0_WIDTH}px repeat(${
    numCols - 1
  }, minmax(${SCHEDULE_COL_N_MIN_WIDTH}px, 1fr))`
  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.400')
  const backgroundColor = useColorModeValue('gray.50', 'gray.800')

  if (isError) {
    return <div>{error?.message}</div>
  }

  return (
    <Box h="100%" bg={backgroundColor}>
      <ScheduleNav
        isLoading={isLoading}
        scheduledAt={scheduledAt}
        setScheduledAt={(date: Date) => setScheduledAt(date)}
      />
      <Box px={16} mx="auto" maxW="6xl">
        <ScheduleToolbar isLoading={isLoading} />
        {/* schedule header container */}
        <Skeleton isLoaded={!isLoading}>
          <Box>
            <SimpleGrid templateColumns={templateCols} rows={2} spacing={0}>
              {/* header row */}
              {rows[0]?.cells.map((cell) => (
                <ScheduleColHeader key={cell.key} cell={cell} />
              )) ?? null}
              {/* header row spacer */}
              {rows[0]?.cells.map((cell) => {
                return (
                  <Flex
                    key={`hrs-0-${cell.key}`}
                    height="20px"
                    borderColor={borderColor}
                    sx={{
                      ...(cell.colIdx > 0 ? { borderBottomWidth: '1px' } : {}),
                      ...(cell.colIdx < numCols - 1
                        ? { borderRightWidth: '1px' }
                        : {}),
                    }}
                  >
                    {cell.colIdx === 0 && (
                      <>
                        <Spacer />
                        <Box
                          w="20px"
                          borderBottomWidth="1px"
                          borderColor={borderColor}
                        />
                      </>
                    )}
                  </Flex>
                )
              }) ?? null}
            </SimpleGrid>
          </Box>
        </Skeleton>

        {/* schedule grid container */}
        <Skeleton isLoaded={!isLoading}>
          <Box
            sx={{
              overscrollBehavior: 'contain',
            }}
            overflowY="auto"
            h="calc(100vh - 15rem)"
          >
            <Grid templateRows={templateRows} templateColumns={templateCols}>
              {/* row spacer 0 */}
              {rows[0]?.cells.map((cell) => (
                <GridItem
                  key={`drs-0-${cell.key}`}
                  borderColor={borderColor}
                  sx={{
                    ...(cell.colIdx < numCols - 1
                      ? { borderRightWidth: '1px' }
                      : {}),
                  }}
                />
              )) ?? null}

              {/* row spacer 1 */}
              {rows[0]?.cells.map((cell) => {
                return (
                  <GridItem
                    key={`drs-1-${cell.key}`}
                    borderColor={borderColor}
                    sx={{
                      ...(cell.colIdx > 0 ? { borderBottomWidth: '1px' } : {}),
                      ...(cell.colIdx < numCols - 1
                        ? { borderRightWidth: '1px' }
                        : {}),
                    }}
                  >
                    {cell.colIdx === 0 && (
                      <Flex h="100%">
                        <Spacer />
                        <Box
                          w="20px"
                          borderBottomWidth="1px"
                          borderColor={borderColor}
                        />
                      </Flex>
                    )}
                  </GridItem>
                )
              }) ?? null}

              {/* data rows (row 1..n) */}
              {rows.slice(1).map((row) =>
                row.cells.map((cell) => {
                  switch (cell.kind) {
                    case CellKind.ROW_HEADER:
                      return (
                        <ScheduleRowHeader
                          key={cell.key}
                          cell={cell}
                          numRows={numRows}
                          timeBlockInMinutes={
                            data.scheduleConfig.timeBlockInMinutes
                          }
                        />
                      )
                    case CellKind.DATA_CELL:
                      return (
                        <ScheduleDataCell
                          key={cell.key}
                          cell={cell}
                          rows={rows}
                          updateTicket={updateTicketMutation}
                          timeBlockInMinutes={
                            data.scheduleConfig.timeBlockInMinutes
                          }
                        />
                      )
                    default:
                      return null
                  }
                })
              )}
            </Grid>
          </Box>
        </Skeleton>
      </Box>
    </Box>
  )
}
