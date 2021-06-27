import _ from 'lodash'
import { set, format, addMinutes } from 'date-fns'

import type {
  VehicleData,
  TimeData,
  TicketData,
  RowHeader,
  ColHeader,
  Cell,
  ScheduleMatrix,
} from '@/types/types'

/**
 *
 *
 *
 */
export const makeTimeRangeListForDate = ({
  startTime = 8,
  endTime = 18,
  date = new Date(Date.now()),
  timeIntervalInMinutes = 30,
} = {}): Date[] => {
  const range: Date[] = []

  let day = set(date, {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDay(),
    hours: startTime,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

  while (startTime < endTime) {
    range.push(day)
    day = addMinutes(day, timeIntervalInMinutes)
    startTime = day.getHours()
  }

  return range
}

/**
 *
 *
 *
 */
export const makeTimeDataList = (
  dateRange: Date[] = [],
  timeIntervalInMinutes = 30
): TimeData[] =>
  dateRange.map((date, idx) => {
    const timeFactor = 60 / timeIntervalInMinutes
    return {
      id: format(date, 'h:mm a'),
      time: idx % timeFactor !== 0 ? '' : format(date, 'h a'),
    }
  })

/**
 *
 *
 *
 */
export const makeRowHeaders = (times: TimeData[] = []): RowHeader[] => {
  return times.map((timeData) => ({
    display: timeData.time,
    data: timeData,
  }))
}

/**
 *
 *
 *
 */
export const makeColHeaders = (vehicles: VehicleData[] = []): ColHeader[] => {
  return [
    { display: '', data: undefined }, // tack on the empty first column
    ...vehicles.map((vehicleData) => ({
      display: vehicleData.vehicleName,
      data: vehicleData,
    })),
  ]
}

/**
 *
 *
 *
 */
export const computeTicketFields = (tickets: TicketData[]): TicketData[] => {
  return tickets.map((ticket) => {
    const scheduledDate = new Date(ticket.scheduledDateTimeISO)
    const scheduledStartTime = format(scheduledDate, 'h:mm a')
    const timeRange = `${format(scheduledDate, 'h:mmaaa')} - ${format(
      addMinutes(scheduledDate, ticket.durationInMinutes),
      'h:mmaaa'
    )}`

    return { ...ticket, timeRange, scheduledStartTime }
  })
}

/**
 *
 *
 *
 */
export const groupTicketsBy = (
  tickets: TicketData[] = [],
  rowField: keyof TicketData,
  colField: keyof TicketData
): { [key: string]: { [key: string]: TicketData } } => {
  const ticketsByRow = _.groupBy(tickets, (ticket) => ticket[rowField])

  return Object.keys(ticketsByRow).reduce(
    (result, rowKey) => ({
      ...result,
      [rowKey]: _.keyBy(ticketsByRow[rowKey], colField),
    }),
    {}
  )
}

/**
 *
 *
 *
 */
interface MakeCellsProps {
  tickets: TicketData[]
  rowHeaders: RowHeader[]
  colHeaders: ColHeader[]
}

export const makeCells = ({
  tickets = [],
  rowHeaders = [],
  colHeaders = [],
}: MakeCellsProps): Cell[][] => {
  if (!tickets.every((ticket) => 'scheduledStartTime' in ticket)) {
    throw new Error(
      `Missing ticket field: 'scheduledStartTime'. Call 'computeTicketFields'`
    )
  }

  const ticketHash = groupTicketsBy(tickets, 'scheduledStartTime', 'vehicleId')
  const columns = colHeaders.slice(1)

  return rowHeaders.map((row, rowIdx) =>
    columns.map((col, colIdx) => {
      const ticket = col.data
        ? _.get(ticketHash, [row.data.id, col.data.id])
        : undefined

      return {
        rowIdx,
        colIdx,
        data: ticket,
      }
    })
  )
}

/**
 *
 *
 *
 */
export const makeScheduleMatrix = ({
  rowHeaders,
  colHeaders,
  cells,
  timeIntervalInMinutes,
}: ScheduleMatrix): ScheduleMatrix => {
  return {
    rowHeaders,
    colHeaders,
    cells,
    timeIntervalInMinutes,
  }
}

/**
 *
 *
 *
 */
export const getPreviousCellWithTicket = (
  cell: Cell,
  matrix: ScheduleMatrix
): Cell | undefined => {
  let idx = 1

  while (idx < cell.rowIdx) {
    const prevCell = matrix.cells[cell.rowIdx - idx]?.[cell.colIdx]
    const ticket = prevCell?.data

    if (ticket) {
      return prevCell
    }

    idx += 1
  }

  return undefined
}

/**
 *
 *
 *
 */
export const isCellCoveredByTicket = (
  cell: Cell,
  prevCell: Cell,
  timeIntervalInMinutes: number
): boolean => {
  const rowDiff = cell.rowIdx - prevCell.rowIdx
  const ticket = cell.data
  const prevTicket = prevCell.data

  if (ticket) {
    throw new Error('Cell has a ticket. Cannot test for coverage.')
  }

  if (!prevTicket) {
    throw new Error('Previous cell must have a ticket. Coverage test failed.')
  }

  return prevTicket.durationInMinutes / timeIntervalInMinutes >= rowDiff + 1
}

/**
 *
 *
 *
 */
export const isSpaceForTicketAtCell = (
  ticket: TicketData,
  targetCell: Cell,
  matrix: ScheduleMatrix
): boolean => {
  const numCellsNeeded = ticket.durationInMinutes / matrix.timeIntervalInMinutes

  if (targetCell.rowIdx + numCellsNeeded >= matrix.cells.length) {
    return false
  }

  for (let offset = 0; offset < numCellsNeeded; offset += 1) {
    const cell = matrix.cells[targetCell.rowIdx + offset]?.[targetCell.colIdx]
    const cellTicket = cell?.data

    if (cellTicket && !(cellTicket.id === ticket.id)) {
      return false
    }
  }

  return true
}
