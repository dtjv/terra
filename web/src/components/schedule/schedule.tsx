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
import { set } from 'date-fns'
import { useState } from 'react'
import {
  ScheduleNav,
  ScheduleColHeader,
  ScheduleRowHeader,
  ScheduleDataCell,
} from '@/components/schedule'
import { CellKind } from '@/types/enums'
import { useSchedule } from '@/hooks/use-schedule'
import { VehicleContext } from '@/contexts/vehicle-context'
import type { Vehicle } from '@/types/types'

export interface ScheduleProps {
  vehicles: Vehicle[]
}

export const Schedule = ({ vehicles }: ScheduleProps) => {
  const [scheduledAt, setScheduledAt] = useState(
    set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
  )
  const {
    rows,
    numRows,
    numCols,
    data,
    error,
    isLoading,
    isError,
    updateTicketMutation,
  } = useSchedule({ vehicles, scheduledAt })
  const templateRows = `repeat(${numRows}, minmax(35px, 1fr))`
  const templateCols = `80px repeat(${numCols - 1}, minmax(100px, 1fr))`
  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.400')
  const backgroundColor = useColorModeValue('gray.50', 'gray.800')

  if (isError) {
    return <div>{error?.message}</div>
  }

  return (
    <VehicleContext.Provider value={{ vehicles }}>
      <Box h="100%" bg={backgroundColor}>
        <ScheduleNav
          isLoading={isLoading}
          scheduledAt={scheduledAt}
          isPastSchedule={data.isPastSchedule}
          setScheduledAt={(date: Date) => setScheduledAt(date)}
        />
        <Box p={8} mx="auto" maxW="6xl">
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
                        ...(cell.colIdx > 0
                          ? { borderBottomWidth: '1px' }
                          : {}),
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
              h="calc(100vh - 13.5rem)"
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
                        ...(cell.colIdx > 0
                          ? { borderBottomWidth: '1px' }
                          : {}),
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
                            isPastSchedule={data.isPastSchedule}
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
    </VehicleContext.Provider>
  )
}
