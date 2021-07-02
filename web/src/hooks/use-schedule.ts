import * as React from 'react'
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

const SCHEDULE_CONFIG_DEFAULTS = {
  startHour: 8,
  endHour: 18,
  timeBlockInMinutes: 30,
}

export const useSchedule = () => {
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
  }, [scheduleConfigQuery.data])

  const colHeaders = React.useMemo(
    () =>
      vehiclesQuery.isLoading || vehiclesQuery.isError
        ? []
        : makeColHeaders(vehiclesQuery.data ?? []),
    [vehiclesQuery.data]
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
    [ticketsQuery.data, rowHeaders, colHeaders]
  )

  return {
    rows,
    updateTicketMutation,
    data: {
      tickets: ticketsQuery.data ?? [],
      vehicles: vehiclesQuery.data ?? [],
      scheduleConfig: scheduleConfigQuery.data ?? [],
    },
  }
}
