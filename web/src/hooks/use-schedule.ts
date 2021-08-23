import { useMemo } from 'react'
import { set, isBefore } from 'date-fns'
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

export interface useScheduleProps {
  vehicles: Vehicle[]
  scheduledAt: Date
}

export const useSchedule = ({ vehicles, scheduledAt }: useScheduleProps) => {
  const { ticketsQuery, updateTicketMutation } = useTickets({ scheduledAt })
  const today = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })
  const isPastSchedule = isBefore(scheduledAt, today)
  const colHeaders = makeColHeaders({ vehicles })
  const rowHeaders = useMemo(
    () =>
      makeRowHeaders({
        scheduleTimes: makeScheduleTimes({ ...scheduleConfig }),
      }),
    []
  )
  const rows = useMemo(() => {
    return ticketsQuery.isLoading || ticketsQuery.isError
      ? []
      : makeRows({
          tickets: ticketsQuery.data ?? [],
          rowHeaders,
          colHeaders,
          timeBlockInMinutes: scheduleConfig.timeBlockInMinutes,
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
      isPastSchedule,
    },
  }
}
