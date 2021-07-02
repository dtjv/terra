import * as React from 'react'
import type { UseMutationResult } from 'react-query'

import { useTickets } from '@/hooks/use-tickets'
import { useVehicles } from '@/hooks/use-vehicles'
import { useScheduleConfig } from '@/hooks/use-schedule-config'
import {
  makeScheduleTimes,
  makeRows,
  makeRowHeaders,
  makeColHeaders,
  computeTicketFields,
} from '@/lib/utils'
import type { Row, TicketData, VehicleData, ScheduleData } from '@/types/types'

const SCHEDULE_CONFIG_DEFAULTS = {
  id: '',
  startHour: 8,
  endHour: 18,
  timeBlockInMinutes: 30,
}

export type UseScheduleReturnType = {
  isLoading: boolean
  isError: boolean
  error: Error | undefined
  rows: Row[]
  updateTicketMutation: UseMutationResult<
    TicketData,
    Error,
    TicketData,
    { previousTickets: TicketData[] | undefined }
  >
  data: {
    tickets: TicketData[]
    vehicles: VehicleData[]
    scheduleConfig: ScheduleData
  }
}

export const useSchedule = (): UseScheduleReturnType => {
  const { ticketsQuery, updateTicketMutation } = useTickets()
  const { vehiclesQuery } = useVehicles()
  const { scheduleConfigQuery } = useScheduleConfig()

  const rowHeaders = React.useMemo(() => {
    if (scheduleConfigQuery.isLoading || scheduleConfigQuery.isError) {
      return []
    }

    const { startHour, endHour, timeBlockInMinutes } =
      scheduleConfigQuery.data ?? SCHEDULE_CONFIG_DEFAULTS

    return makeRowHeaders({
      scheduleTimes: makeScheduleTimes({
        startHour,
        endHour,
        timeBlockInMinutes,
      }),
      timeBlockInMinutes,
    })
  }, [scheduleConfigQuery])

  const colHeaders = React.useMemo(
    () =>
      vehiclesQuery.isLoading || vehiclesQuery.isError
        ? []
        : makeColHeaders(vehiclesQuery.data ?? []),
    [vehiclesQuery]
  )

  const rows = React.useMemo(
    () =>
      ticketsQuery.isLoading || ticketsQuery.isError
        ? []
        : makeRows({
            tickets: computeTicketFields(ticketsQuery.data ?? []),
            rowHeaders,
            colHeaders,
          }),
    [ticketsQuery, rowHeaders, colHeaders]
  )

  return {
    isLoading:
      scheduleConfigQuery.isLoading ||
      ticketsQuery.isLoading ||
      vehiclesQuery.isLoading,
    isError:
      scheduleConfigQuery.isError ||
      ticketsQuery.isError ||
      vehiclesQuery.isError,
    error: scheduleConfigQuery.isError
      ? (scheduleConfigQuery.error as Error)
      : ticketsQuery.isError
      ? (ticketsQuery.error as Error)
      : vehiclesQuery.isError
      ? (vehiclesQuery.error as Error)
      : undefined,
    rows,
    updateTicketMutation,
    data: {
      tickets: ticketsQuery.data ?? [],
      vehicles: vehiclesQuery.data ?? [],
      scheduleConfig: scheduleConfigQuery.data ?? SCHEDULE_CONFIG_DEFAULTS,
    },
  }
}
