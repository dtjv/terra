import _ from 'lodash'
import { set, format, addMinutes } from 'date-fns'

import { CellKind } from '@/types/types'
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
  return [
    { kind: CellKind.ROW_HEADER, display: '', id: '', time: '' },
    ...times.map(
      (timeData) =>
        ({
          kind: CellKind.ROW_HEADER,
          display: timeData.time,
          ...timeData,
        } as RowHeader)
    ),
  ]
}

/**
 *
 *
 *
 */
export const makeColHeaders = (vehicles: VehicleData[] = []): ColHeader[] => {
  return [
    { kind: CellKind.COL_HEADER, display: '', id: '', vehicleName: '' },
    ...vehicles.map(
      (vehicleData) =>
        ({
          kind: CellKind.COL_HEADER,
          display: vehicleData.vehicleName,
          ...vehicleData,
        } as ColHeader)
    ),
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

  return rowHeaders.map((rowHeader, rowIdx) => {
    return colHeaders.map((colHeader, colIdx) => {
      const cell = { rowIdx, colIdx }

      if (rowIdx === 0) {
        return { ...cell, data: colHeader }
      }

      if (colIdx === 0) {
        return { ...cell, data: rowHeader }
      }

      return {
        ...cell,
        data: {
          kind: CellKind.DATA_CELL,
          ticket: _.get(ticketHash, [rowHeader.id, colHeader.id]),
        },
      }
    })
  })
}

/**
 *
 *
 *
 */
export const getPreviousCellWithTicket = (
  cell: Cell,
  cells: Cell[][]
): Cell | undefined => {
  let idx = 1

  while (idx < cell.rowIdx) {
    const prevCell = cells[cell.rowIdx - idx]?.[cell.colIdx]

    if (prevCell?.data.kind === CellKind.DATA_CELL && prevCell.data.ticket) {
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
export interface IsCellCoveredByTicketProps {
  cell: Cell
  prevCell: Cell
  timeIntervalInMinutes: number
}

export const isCellCoveredByTicket = ({
  cell,
  prevCell,
  timeIntervalInMinutes,
}: IsCellCoveredByTicketProps): boolean => {
  if (
    cell.data.kind !== CellKind.DATA_CELL ||
    prevCell.data.kind !== CellKind.DATA_CELL
  ) {
    throw new Error('Both cells passed must be DATA_CELL kind.')
  }

  const rowDiff = cell.rowIdx - prevCell.rowIdx
  const ticket = cell.data.ticket
  const prevTicket = prevCell.data.ticket

  if (ticket) {
    throw new Error('`cell` has a ticket - it cannot be covered.')
  }

  if (!prevTicket) {
    throw new Error('`prevCell` must have a ticket.')
  }

  return prevTicket.durationInMinutes / timeIntervalInMinutes >= rowDiff + 1
}

/**
 *
 *
 *
 */
export interface IsSpaceForTicketAtCell {
  ticket: TicketData
  targetCell: Cell
  matrix: ScheduleMatrix
}
export const isSpaceForTicketAtCell = ({
  ticket,
  targetCell,
  matrix,
}: IsSpaceForTicketAtCell): boolean => {
  if (targetCell.data.kind !== CellKind.DATA_CELL) {
    throw new Error('`targetCell` must be DATA_CELL kind.')
  }

  const numCellsNeeded = ticket.durationInMinutes / matrix.timeIntervalInMinutes

  if (targetCell.rowIdx + numCellsNeeded - 1 >= matrix.cells.length) {
    return false
  }

  for (let offset = 1; offset < numCellsNeeded; offset += 1) {
    const cell = matrix.cells[targetCell.rowIdx + offset]?.[targetCell.colIdx]
    const cellTicket =
      cell?.data.kind === CellKind.DATA_CELL ? cell.data.ticket : undefined

    if (cellTicket && !(cellTicket.id === ticket.id)) {
      return false
    }
  }

  return true
}
