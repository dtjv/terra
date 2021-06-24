export interface ScheduleConfig {
  scheduleStartTime: number
  scheduleEndTime: number
  timeIntervalInMinutes: number
}

export interface Vehicle {
  id: string
  displayValue: string
}

export interface Time {
  id: string
  displayValue: string
  originalDateTime: Date
}

/*
 * TODO: `durationTimeRange` must be calculated at save/update.
 *   durationTimeRange =
 *    `${format(row.originalDatetime, "h:mmaaa")} - ${format(
 *      addMinutes(row.original, ticket.duration), "h:mmaaa")}`
 */
export interface Ticket {
  id: string
  vehicleId: string
  scheduledTime: string
  duration: number
  durationTimeRange: string
}

export interface Cell {
  rIdx: number
  cIdx: number
  data: Ticket | Time | Vehicle | undefined
}

export interface Grid {
  cells: Cell[][]
  timeIntervalInMinutes: number
}
