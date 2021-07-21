import * as React from 'react'
import type { UseMutationResult } from 'react-query'
import { useTickets } from '@/hooks/use-tickets'
import { useVehicles } from '@/hooks/use-vehicles'
import {
  makeScheduleTimes,
  makeRows,
  makeRowHeaders,
  makeColHeaders,
} from '@/lib/utils'
import type { Row, Ticket, Vehicle, TicketContext } from '@/types/types'

const startHour = process.env['NEXT_PUBLIC_SCHEDULE_START_HOUR_IN_24HR'] ?? '8'
const endHour = process.env['NEXT_PUBLIC_SCHEDULE_END_HOUR_IN_24HR'] ?? '18'
const timeBlockInMinutes =
  process.env['NEXT_PUBLIC_SCHEDULE_TIME_BLOCK_IN_MINUTES'] ?? '30'

const scheduleConfig = {
  startHour: parseInt(startHour, 10),
  endHour: parseInt(endHour, 10),
  timeBlockInMinutes: parseInt(timeBlockInMinutes, 10),
}

type UseScheduleReturnType = {
  isLoading: boolean
  isError: boolean
  error: Error | undefined
  rows: Row[]
  updateTicketMutation: UseMutationResult<Ticket, Error, Ticket, TicketContext>
  data: {
    tickets: Ticket[]
    vehicles: Vehicle[]
    scheduleConfig: {
      startHour: number
      endHour: number
      timeBlockInMinutes: number
    }
  }
}

export const useSchedule = (): UseScheduleReturnType => {
  const { ticketsQuery, updateTicketMutation } = useTickets()
  const { vehiclesQuery } = useVehicles()

  const rowHeaders = React.useMemo(() => {
    return makeRowHeaders({
      scheduleTimes: makeScheduleTimes(scheduleConfig),
      timeBlockInMinutes: scheduleConfig.timeBlockInMinutes,
    })
  }, [])

  const colHeaders = React.useMemo(() => {
    return vehiclesQuery.isLoading || vehiclesQuery.isError
      ? []
      : makeColHeaders(vehiclesQuery.data ?? [])
  }, [vehiclesQuery])

  const rows = React.useMemo(() => {
    return ticketsQuery.isLoading || ticketsQuery.isError
      ? []
      : makeRows({
          tickets: ticketsQuery.data ?? [],
          rowHeaders,
          colHeaders,
        })
  }, [ticketsQuery, rowHeaders, colHeaders])

  return {
    isLoading: ticketsQuery.isLoading || vehiclesQuery.isLoading,
    isError: ticketsQuery.isError || vehiclesQuery.isError,
    error: ticketsQuery.isError
      ? (ticketsQuery.error as Error)
      : vehiclesQuery.isError
      ? (vehiclesQuery.error as Error)
      : undefined,
    rows,
    updateTicketMutation,
    data: {
      scheduleConfig,
      tickets: ticketsQuery.data ?? [],
      vehicles: vehiclesQuery.data ?? [],
    },
  }
}
