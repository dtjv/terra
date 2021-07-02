import _ from 'lodash'
import { set, format, addMinutes } from 'date-fns'

import { CellKind } from '@/types/types'
import type {
  VehicleData,
  TicketData,
  Row,
  Cell,
  RowHeader,
  ColHeader,
} from '@/types/types'

/**
 *
 *
 *
 */
export interface MakeScheduleTimesProps {
  startHour: number
  endHour: number
  date?: Date
  timeBlockInMinutes: number
}

export const makeScheduleTimes = ({
  startHour,
  endHour,
  date = new Date(Date.now()),
  timeBlockInMinutes,
}: MakeScheduleTimesProps): Date[] => {
  const scheduleTimes: Date[] = []

  let scheduleTime = set(date, {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDay(),
    hours: startHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

  while (startHour < endHour) {
    scheduleTimes.push(scheduleTime)
    scheduleTime = addMinutes(scheduleTime, timeBlockInMinutes)
    startHour = scheduleTime.getHours()
  }

  return scheduleTimes
}

/**
 *
 *
 *
 */
export interface MakeRowHeadersProps {
  scheduleTimes: Date[]
  timeBlockInMinutes?: number
}

export const makeRowHeaders = ({
  scheduleTimes,
  timeBlockInMinutes = 30,
}: MakeRowHeadersProps): RowHeader[] => {
  return [
    {
      scheduleTimeISO: '',
      hourFormat: '',
      hourMinuteFormat: '',
    },
    ...scheduleTimes.map((scheduleTime, idx) => {
      const timeFactor = 60 / timeBlockInMinutes
      return {
        scheduleTimeISO: scheduleTime.toISOString(),
        hourMinuteFormat: format(scheduleTime, 'h:mm a'),
        hourFormat: idx % timeFactor !== 0 ? '' : format(scheduleTime, 'h a'),
      }
    }),
  ]
}

/**
 *
 *
 *
 */
export const makeColHeaders = (vehicles: VehicleData[]): ColHeader[] => {
  return [{ id: '', vehicleId: '', vehicleName: '' }, ...vehicles]
}

/**
 *
 *
 *
 */
export const computeTicketFields = (tickets: TicketData[]): TicketData[] => {
  return tickets.map((ticket) => {
    const scheduledDateTime = new Date(ticket.scheduledDateTimeISO)
    const scheduledStartTime = format(scheduledDateTime, 'h:mm a')
    const timeRange = `${format(scheduledDateTime, 'h:mmaaa')} - ${format(
      addMinutes(scheduledDateTime, ticket.durationInMinutes),
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
export interface GroupTicketsByProps {
  tickets: TicketData[]
  rowField: keyof TicketData
  colField: keyof TicketData
}

export const groupTicketsBy = ({
  tickets,
  rowField,
  colField,
}: GroupTicketsByProps): { [key: string]: { [key: string]: TicketData } } => {
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
export interface MakeRowsProps {
  tickets: TicketData[]
  rowHeaders: RowHeader[]
  colHeaders: ColHeader[]
}

export const makeRows = ({
  tickets,
  rowHeaders,
  colHeaders,
}: MakeRowsProps): Row[] => {
  if (!tickets.every((ticket) => 'scheduledStartTime' in ticket)) {
    throw new Error(
      `Missing ticket field: 'scheduledStartTime'. Call 'computeTicketFields'`
    )
  }

  const ticketHash = groupTicketsBy({
    tickets,
    rowField: 'scheduledStartTime',
    colField: 'vehicleId',
  })

  return rowHeaders.map((rowHeader, rowIdx) => {
    const row: Row = {
      key: `row-${rowIdx}`,
      cells: colHeaders.map((colHeader, colIdx) => {
        const defaultFields = {
          key: `${rowIdx}-${colIdx}`,
          rowIdx,
          colIdx,
        }
        let cell: Cell

        if (rowIdx === 0) {
          cell = {
            ...defaultFields,
            ...colHeader,
            kind: CellKind.COL_HEADER,
            display: colHeader.vehicleName,
          }
          return cell
        }

        if (colIdx === 0) {
          cell = {
            ...defaultFields,
            ...rowHeader,
            kind: CellKind.ROW_HEADER,
            display: rowHeader.hourFormat,
          }
          return cell
        }

        cell = {
          ...defaultFields,
          kind: CellKind.DATA_CELL,
          rowHeader,
          colHeader,
          ticket: _.get(ticketHash, [
            rowHeader.hourMinuteFormat,
            colHeader.vehicleId,
          ]),
        }

        return cell
      }),
    }

    return row
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

    if (prevCell?.kind === CellKind.DATA_CELL && prevCell.ticket) {
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
  timeBlockInMinutes: number
}

export const isCellCoveredByTicket = ({
  cell,
  prevCell,
  timeBlockInMinutes,
}: IsCellCoveredByTicketProps): boolean => {
  if (
    cell.kind !== CellKind.DATA_CELL ||
    prevCell.kind !== CellKind.DATA_CELL
  ) {
    throw new Error('Both cells passed must be DATA_CELL kind.')
  }

  const rowDiff = cell.rowIdx - prevCell.rowIdx
  const ticket = cell.ticket
  const prevTicket = prevCell.ticket

  if (ticket) {
    throw new Error('`cell` has a ticket - it cannot be covered.')
  }

  if (!prevTicket) {
    throw new Error('`prevCell` must have a ticket.')
  }

  return prevTicket.durationInMinutes / timeBlockInMinutes >= rowDiff + 1
}

/**
 *
 *
 *
 */
export interface IsSpaceForTicketAtCellProps {
  ticket: TicketData
  targetCell: Cell
  rows: Row[]
  timeBlockInMinutes: number
}

export const isSpaceForTicketAtCell = ({
  ticket,
  targetCell,
  rows,
  timeBlockInMinutes,
}: IsSpaceForTicketAtCellProps): boolean => {
  if (targetCell.kind !== CellKind.DATA_CELL) {
    throw new Error('`targetCell` must be DATA_CELL kind.')
  }

  const numCellsNeeded = ticket.durationInMinutes / timeBlockInMinutes

  if (targetCell.rowIdx + numCellsNeeded - 1 >= rows.length) {
    return false
  }

  for (let offset = 1; offset < numCellsNeeded; offset += 1) {
    const cell = rows[targetCell.rowIdx + offset]?.cells[targetCell.colIdx]
    const cellTicket =
      cell?.kind === CellKind.DATA_CELL ? cell.ticket : undefined

    if (cellTicket && !(cellTicket.id === ticket.id)) {
      return false
    }
  }

  return true
}
