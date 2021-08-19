import { useMemo } from 'react'
import { useTickets } from '@/hooks/use-tickets'
import {
  makeScheduleTimes,
  makeRows,
  makeRowHeaders,
  makeColHeaders,
} from '@/lib/utils'
import {
  SCHEDULE_START_HOUR_IN_24HR,
  SCHEDULE_END_HOUR_IN_24HR,
  SCHEDULE_TIME_BLOCK_IN_MINUTES,
} from '@/config'
import type { Vehicle } from '@/types/types'

const scheduleConfig = {
  startHour: SCHEDULE_START_HOUR_IN_24HR,
  endHour: SCHEDULE_END_HOUR_IN_24HR,
  timeBlockInMinutes: SCHEDULE_TIME_BLOCK_IN_MINUTES,
}

export const useSchedule = (vehicles: Vehicle[]) => {
  const { ticketsQuery, updateTicketMutation } = useTickets()

  const colHeaders = makeColHeaders(vehicles)

  const rowHeaders = useMemo(() => {
    return makeRowHeaders({
      scheduleTimes: makeScheduleTimes(scheduleConfig),
      timeBlockInMinutes: scheduleConfig.timeBlockInMinutes,
    })
  }, [])

  const rows = useMemo(() => {
    return ticketsQuery.isLoading || ticketsQuery.isError
      ? []
      : makeRows({
          tickets: ticketsQuery.data ?? [],
          rowHeaders,
          colHeaders,
        })
  }, [ticketsQuery, rowHeaders, colHeaders])

  return {
    isLoading: ticketsQuery.isLoading,
    isError: ticketsQuery.isError,
    error: ticketsQuery.isError ? (ticketsQuery.error as Error) : undefined,
    rows,
    updateTicketMutation,
    data: {
      scheduleConfig,
      vehicles,
      tickets: ticketsQuery.data ?? [],
    },
  }
}
