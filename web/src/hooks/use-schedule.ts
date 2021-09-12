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
} from '@/config/constants'
import type { Vehicle } from '@/types/types'

const scheduleConfig = {
  startHour: SCHEDULE_START_HOUR_IN_24HR,
  endHour: SCHEDULE_END_HOUR_IN_24HR,
  timeBlockInMinutes: SCHEDULE_TIME_BLOCK_IN_MINUTES,
}

export interface UseScheduleProps {
  vehicles: Vehicle[]
  scheduledAt: Date
}

export const useSchedule = ({ vehicles, scheduledAt }: UseScheduleProps) => {
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
    return ticketsQuery.data
      ? makeRows({
          tickets: ticketsQuery.data,
          rowHeaders,
          colHeaders,
          timeBlockInMinutes: scheduleConfig.timeBlockInMinutes,
        })
      : []
  }, [ticketsQuery.data, rowHeaders, colHeaders])

  // why +1?
  //
  // assume schedule runs 8am-6pm in 30min blocks. then...
  //
  //   rows.length = 21 (1 header, 20 data)
  //   numRows = 21 + 1 (2 empty grid rows + 20 data grid rows)
  //
  // the two empty grid rows allow 8am not be cut off by header in ui.
  //
  // Note:
  // 1. bad design
  // 2. this breaks if time block is not 30!
  const numRows = rows.length + 1
  const numCols = rows[0]?.cells.length ?? 0

  return {
    isLoading: ticketsQuery.isLoading,
    isError: ticketsQuery.isError,
    error: ticketsQuery.isError ? (ticketsQuery.error as Error) : undefined,
    rows,
    numRows,
    numCols,
    updateTicketMutation,
    data: {
      scheduleConfig,
      isPastSchedule,
    },
  }
}
