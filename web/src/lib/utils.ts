import { get, groupBy, keyBy } from 'lodash'
import { set, format, add } from 'date-fns'
import { CellKind } from '@/types/enums'
import {
  SCHEDULE_START_HOUR_IN_24HR,
  SCHEDULE_END_HOUR_IN_24HR,
  SCHEDULE_TIME_BLOCK_IN_MINUTES,
} from '@/config/constants'
import type {
  Ticket,
  Vehicle,
  Row,
  Cell,
  RowHeader,
  ColHeader,
} from '@/types/types'

export const isMultiple = (num: number, factor: number) => num % factor === 0

export const makeTime = (hour: number) => {
  const date = set(new Date(), {
    hours: hour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

  return format(date, 'HH:mm:ss.SSS')
}

/**
 * @param {string} time - Format: 'HH.mm.ss.SSS' (see date-fns/format).
 * @returns {Date} Sets 'time' to 'date' and returns a new Date object.
 */
export const combineDateTime = (date: Date, time: string): Date => {
  const [hour, minute, rest] = time.split(':')
  const [seconds, milliseconds] = rest?.split('.') ?? []

  return set(date, {
    hours: parseInt(hour ?? '0', 10),
    minutes: parseInt(minute ?? '0', 10),
    seconds: parseInt(seconds ?? '0', 10),
    milliseconds: parseInt(milliseconds ?? '0', 10),
  })
}

export interface MakeScheduleTimesProps {
  startHour: number
  endHour: number
  timeBlockInMinutes: number
}

/**
 * @returns {Array} An array of times, every `timeBlockInMinutes`.
 * @example
 *   makeScheduleTimes({ startHour: 8, endHour: 11, timeBlockInMinutes: 30 })
 *   // [ '08:00:00.000', '08:30:00.000',
 *   //   '09:00:00.000', '09:30:00.000',
 *   //   '10:00:00.000', '10:30:00.000' ]
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
 * @returns {Array} Row headers, prepended with an empty one for column headers.
 * @example
 *   const scheduleTimes = makeScheduleTimes({ startHour: 8, endHour: 9 })
 *   makeRowHeaders({ scheduleTimes })
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
      const date = combineDateTime(new Date(), time)
      return {
        time,
        timeHour: format(date, 'h a'),
        timeHourMinute: format(date, 'h:mm a'),
      }
    }),
  ]
}

export interface MakeColHeadersProps {
  vehicles: Vehicle[]
}

/**
 * @returns {Array} Column headers, prepended with an empty one for row headers.
 */
export const makeColHeaders = ({
  vehicles,
}: MakeColHeadersProps): ColHeader[] => {
  return [{ id: '', vehicleKey: '', vehicleName: '' }, ...vehicles]
}

export interface GroupTicketsByProps {
  tickets: Ticket[]
  rowField: keyof Ticket
  colField: keyof Ticket
}

/**
 * @returns {Object} A two-level hash of `tickets`.
 * @example
 *   groupTicketsBy({
 *     tickets,
 *     rowField: 'scheduledTime',
 *     colField:'vehicleKey'
 *   })
 *   // {
 *   //   '08:00:00.000': {
 *   //     '102': { ticket goes here }
 *   //     '202': { ticket goes here }
 *   //   },
 *   //   '09:30:00.000': {
 *   //     '202': { ticket goes here }
 *   //   },
 *   // }
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
            display: isMultiple(rowIdx - 1, timeFactor)
              ? rowHeader.timeHour
              : '',
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

/*
 * @returns {Cell | undefined} A previous cell found in `cell`'s column that has
 *                             a ticket or, if none found then `undefined`.
 */
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

/*
 * Each cell in the grid represents 1 `timeBlockInMinutes` - let's say 30min. If
 * a cell holds a ticket that's 60min, that ticket's ui height will be 2 x the
 * height of 1 cell (for two 30min blocks). Note the ticket exists on the first
 * cell, but it is covering the next cell in the ui. The next cell cannot and
 * does not hold a cell because it is being covered.
 *
 * However, when we're dragging a ticket around the ui to reschedule it, we may
 * drag over cells that are covered by a previous cell with a ticket. This
 * utility calculates if `cell` is covered or not so the app can determine if
 * a ticket can drop on `cell`
 */
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

/*
 * We might find a cell we can drop on (i.e. it's not covered and doesn't have a
 * ticket already), however, we cannot drop a 60min ticket in a 30min slot (or
 * anthing where ticket duration > available space. This utility calculates if
 * there's space for `ticket` at `targetCell`.
 */
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

  // the ticket can't extend out of bounds of schedule
  if (targetCell.rowIdx + numCellsNeeded - 1 >= rows.length) {
    return false
  }

  for (let offset = 1; offset < numCellsNeeded; offset += 1) {
    const cell = rows[targetCell.rowIdx + offset]?.cells[targetCell.colIdx]
    const cellTicket =
      cell?.kind === CellKind.DATA_CELL ? cell.ticket : undefined

    // no space if we find a ticket that's not the one we're trying to move.
    if (cellTicket && !(cellTicket.id === ticket.id)) {
      return false
    }
  }

  return true
}

export interface Hash {
  [key: string]: number
}

export interface GetAvailableTimesProps {
  vehicleKeys: string[]
  tickets: Ticket[]
  requestDate: Date
  requestTime: string
  durationInMinutes: number
}

export const getAvailableTimes = ({
  vehicleKeys,
  tickets,
  requestDate,
  requestTime,
  durationInMinutes,
}: GetAvailableTimesProps) => {
  const scheduleTimes = makeScheduleTimes({
    startHour: SCHEDULE_START_HOUR_IN_24HR,
    endHour: SCHEDULE_END_HOUR_IN_24HR,
    timeBlockInMinutes: SCHEDULE_TIME_BLOCK_IN_MINUTES,
  })
  const scheduleTimeBlockCount = scheduleTimes.length

  // Create an array of [1|0] to represent a time block as available or not.
  // Mark time blocks before 'requestTime' as not available.
  let bitstr = ''

  for (const scheduleTime of scheduleTimes) {
    if (scheduleTime < requestTime) {
      bitstr += '0'
    }
  }
  bitstr = bitstr.padEnd(scheduleTimeBlockCount, '1')

  const scheduleTimesMask = parseInt(bitstr, 2)

  // Create a hash to associate each 'vehicleKey' to a 'scheduleTimesMask'.
  let vehicleHash: Hash = vehicleKeys.reduce(
    (hash, v) => ({ ...hash, [v]: scheduleTimesMask }),
    {} as Hash
  )

  // Mark each ticket's time blocks as 'not available'.
  for (const ticket of tickets) {
    const ticketTimeBlockCount =
      ticket.durationInMinutes / SCHEDULE_TIME_BLOCK_IN_MINUTES
    const ticketScheduledTimeIndex = scheduleTimes.indexOf(ticket.scheduledTime)

    if (ticketScheduledTimeIndex !== -1) {
      let mask = parseInt(
        (2 ** ticketTimeBlockCount - 1)
          .toString(2)
          .padEnd(scheduleTimeBlockCount, '0'),
        2
      )
      mask >>= ticketScheduledTimeIndex
      vehicleHash[ticket.vehicleKey] ^= mask
    } else {
      console.error(`No time list entry for '${ticket.scheduledTime}'`)
    }
  }

  // After processing above, 'scheduleTimesMask' might be left with leading
  // zeros (i.e. '00011101001') - except leading zero's don't exist in a
  // numeric mask. To preserve the leading zero's and enable further bitwise
  // operation, I prepend a 1.
  vehicleHash = Object.entries(vehicleHash).reduce((hash, [k, v]) => {
    return {
      ...hash,
      [k]: parseInt(
        `1${v.toString(2).padStart(scheduleTimeBlockCount, '0')}`,
        2
      ),
    }
  }, {})

  // Find available time blocks for ticket we're trying to create.
  const ticketTimeBlockCount =
    durationInMinutes / SCHEDULE_TIME_BLOCK_IN_MINUTES
  const shiftCount = scheduleTimeBlockCount - ticketTimeBlockCount

  return Object.entries(vehicleHash)
    .map(([vehicleKey, scheduleTimesMask]) => {
      const times: string[] = []

      // +1 to accommodate first bit
      let mask = parseInt(
        (2 ** ticketTimeBlockCount - 1)
          .toString(2)
          .padEnd(scheduleTimeBlockCount + 1, '0'),
        2
      )
      // adjust to ignore the first bit
      mask >>= 1

      for (let i = 0; i <= shiftCount; i += 1) {
        if ((mask & scheduleTimesMask) === mask) {
          times.push(scheduleTimes[i] ?? 'ERROR')
        }
        mask >>= 1
      }

      return {
        vehicleKey,
        availableTimes: times,
      }
    })
    .flatMap(({ vehicleKey, availableTimes }, i) => {
      return availableTimes.map((time, j) => {
        return {
          key: `${requestDate}-${i}-${j}`,
          vehicleKey,
          scheduledAt: requestDate,
          scheduledTime: time,
          scheduledAtFull: combineDateTime(new Date(requestDate), time),
        }
      })
    })
}
