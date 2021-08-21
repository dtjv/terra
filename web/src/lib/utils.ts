import { get, groupBy, keyBy } from 'lodash'
import { set, format, add } from 'date-fns'
import { CellKind } from '@/types/enums'
import type {
  Ticket,
  Vehicle,
  Row,
  Cell,
  RowHeader,
  ColHeader,
} from '@/types/types'

export const isMultiple = (num: number, factor: number) => num % factor === 0
/*
hourFormat: isMultipleOf(idx, timeFactor) ? format(scheduleTime, 'h a') : '',
*/

export interface MakeScheduleTimesProps {
  startHour: number
  endHour: number
  timeBlockInMinutes: number
}

/**
 * @returns {Array} An array of times, every `timeBlockInMinutes`.
 * @example
 *   // returns:
 *   // [ '08:00:00.000', '08:30:00.000',
 *   //   '09:00:00.000', '09:30:00.000',
 *   //   '10:00:00.000', '10:30:00.000' ]
 *   makeScheduleTimes({ startHour: 8, endHour: 11 })
 */
export const makeScheduleTimes = ({
  startHour,
  endHour,
  timeBlockInMinutes,
}: MakeScheduleTimesProps): string[] => {
  const times: string[] = []

  let date = set(new Date(), {
    hours: startHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

  while (startHour < endHour) {
    times.push(format(date, 'HH:mm:ss.SSS'))
    date = add(date, { minutes: timeBlockInMinutes })
    startHour = date.getHours()
  }

  return times
}

export interface MakeRowHeadersProps {
  scheduleTimes: string[]
}

/**
 * @returns {Array} An array of row headers. Includes an empty row header for
 *                  the column header row.
 * @example
 *   // returns:
 *   // [
 *   //   { time: '',
 *   //     timeHour: '',
 *   //     timeHourMinute: ''
 *   //   },
 *   //   {
 *   //     time: '08:00:00.000',
 *   //     timeHour: '8 AM',
 *   //     timeHourMinute: '8:00 AM',
 *   //   },
 *   //   {
 *   //     time: '08:30:00.000',
 *   //     timeHour: '8 AM',
 *   //     timeHourMinute: '8:30 AM',
 *   //   },
 *   // ]
 *   const scheduleTimes = makeScheduleTimes({ startHour: 8, endHour: 9 })
 *   makeRowHeaders({ scheduleTimes })
 */
export const makeRowHeaders = ({
  scheduleTimes,
}: MakeRowHeadersProps): RowHeader[] => {
  return [
    {
      time: '',
      timeHour: '',
      timeHourMinute: '',
    },
    ...scheduleTimes.map((time) => {
      const [hour, minutes] = time.split(':')
      const date = set(new Date(), {
        hours: parseInt(hour ?? '0', 10),
        minutes: parseInt(minutes ?? '0', 10),
      })

      return {
        time,
        timeHour: format(date, 'h a'),
        timeHourMinute: format(date, 'h:mm a'),
      }
    }),
  ]
}

export const makeColHeaders = (vehicles: Vehicle[]): ColHeader[] => {
  return [{ id: '', vehicleKey: '', vehicleName: '' }, ...vehicles]
}

export interface GroupTicketsByProps {
  tickets: Ticket[]
  rowField: keyof Ticket
  colField: keyof Ticket
}

/**
 * @returns {Object} A two-level hash of `tickets`. (see example below)
 * @example
 *   // returns:
 *   // {
 *   //   '08:00:00.000': {
 *   //     '102': { ticket goes here }
 *   //     '202': { ticket goes here }
 *   //   },
 *   //   '09:30:00.000': {
 *   //     '202': { ticket goes here }
 *   //   },
 *   // }
 *   groupTicketsBy({
 *     tickets,
 *     rowField: 'scheduledTime',
 *     colField:'vehicleKey'
 *   })
 */
export const groupTicketsBy = ({
  tickets,
  rowField,
  colField,
}: GroupTicketsByProps): {
  [key: string]: { [key: string]: Ticket }
} => {
  const ticketsByRow = groupBy(tickets, (ticket) => ticket[rowField])

  return Object.keys(ticketsByRow).reduce(
    (result, rowKey) => ({
      ...result,
      [rowKey]: keyBy(ticketsByRow[rowKey], colField),
    }),
    {}
  )
}

export interface MakeRowsProps {
  tickets: Ticket[]
  rowHeaders: RowHeader[]
  colHeaders: ColHeader[]
  timeBlockInMinutes: number
}

/**
 * TODO: include example output
 */
export const makeRows = ({
  tickets,
  rowHeaders,
  colHeaders,
  timeBlockInMinutes,
}: MakeRowsProps): Row[] => {
  const ticketHash = groupTicketsBy({
    tickets,
    rowField: 'scheduledTime',
    colField: 'vehicleKey',
  })
  const timeFactor = 60 / timeBlockInMinutes

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
            display: isMultiple(rowIdx, timeFactor) ? rowHeader.timeHour : '',
          }
          return cell
        }

        cell = {
          ...defaultFields,
          kind: CellKind.DATA_CELL,
          rowHeader,
          colHeader,
          ticket: get(ticketHash, [rowHeader.time, colHeader.vehicleKey]),
        }

        return cell
      }),
    }

    return row
  })
}

export const getPreviousCellWithTicket = (
  cell: Cell,
  rows: Row[]
): Cell | undefined => {
  let idx = 1

  while (idx < cell.rowIdx) {
    const prevCell = rows[cell.rowIdx - idx]?.cells[cell.colIdx]

    if (prevCell?.kind === CellKind.DATA_CELL && prevCell.ticket) {
      return prevCell
    }

    idx += 1
  }

  return undefined
}

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

export interface IsSpaceForTicketAtCellProps {
  ticket: Ticket
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
