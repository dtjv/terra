import * as _ from 'lodash'
import { set, format, addMinutes } from 'date-fns'

import { Vehicle, Time, Ticket, Cell, Grid } from '../types'

export const makeDateRange = ({
  startTime = 8,
  endTime = 18,
  date = new Date(Date.now()),
  timeIntervalInMintues = 30,
} = {}): Date[] => {
  const range: Date[] = []

  let day = set(date, {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDay(),
    hours: startTime,
    minutes: 0,
  })

  while (startTime < endTime) {
    range.push(day)
    day = addMinutes(day, timeIntervalInMintues)
    startTime = day.getHours()
  }

  return range
}

export const makeTimes = (
  dateRange: Date[] = [],
  timeIntervalInMintues = 30
): Time[] =>
  dateRange.map((date, idx) => {
    const timeFactor = 60 / timeIntervalInMintues
    return {
      id: format(date, 'h:mm a'),
      displayValue: idx % timeFactor !== 0 ? '' : format(date, 'h a'),
      originalDateTime: date,
    }
  })

const groupTicketsBy = (
  tickets: Ticket[] = [],
  rowField: keyof Ticket,
  colField: keyof Ticket
) => {
  const ticketsByRow = _.groupBy(tickets, (ticket) => ticket[rowField])

  return Object.keys(ticketsByRow).reduce(
    (result, rowKey) => ({
      ...result,
      [rowKey]: _.keyBy(ticketsByRow[rowKey], colField),
    }),
    {}
  )
}

export const makeGrid = (
  rowHeaders: Time[] = [],
  colHeaders: Vehicle[] = [],
  tickets: Ticket[] = []
): Cell[][] => {
  const ticketHash = groupTicketsBy(tickets, 'scheduledTime', 'vehicleId')

  const dataGrid: { data: Ticket | undefined }[][] = rowHeaders.map(
    (rowHeader) =>
      colHeaders.map((colHeader) => ({
        data: _.get(ticketHash, [rowHeader.id, colHeader.id]),
      }))
  )

  const grid: Cell[][] = dataGrid.map((row, rIdx) => {
    const cell: Cell = {
      rIdx: rIdx + 1,
      cIdx: 0,
      data: rowHeaders[rIdx],
    }
    return [
      cell,
      ...row.map((cell, cIdx) => ({ rIdx: rIdx + 1, cIdx: cIdx + 1, ...cell })),
    ]
  })

  return [
    [undefined, ...colHeaders].map((column, cIdx) => ({
      rIdx: 0,
      cIdx,
      data: column,
    })),
    ...grid,
  ]
}

export const getPreviousCellWithTicket = (cell, grid) => {
  let i = 1

  while (i < cell.rIdx) {
    const prevCell = grid[cell.rIdx - i][cell.cIdx]

    if (prevCell.data) {
      return prevCell
    }

    i += 1
  }

  return undefined
}

export const isCellCovered = (cell, prevCell, timeIntervalInMintues) => {
  if (cell.data) {
    throw new Error('Cell has a ticket. Cannot test for covereage.')
  }

  const i = cell.rIdx - prevCell.rIdx
  return prevCell.data.duration / timeIntervalInMintues >= i + 1
}

export const isTicketDragTicket = (ticket, dragTicket) =>
  ticket.id === dragTicket.id

export const checkForEmptyCells = (dragTicket, cell, grid) => {
  // -1 for cell - we know its empty
  let numEmptyCellsNeeded = dragTicket.duration / grid.timeIntervalInMintues - 1

  if (cell.rIdx + numEmptyCellsNeeded >= grid.grid.length) {
    return false
  }

  while (numEmptyCellsNeeded > 0) {
    const nextCell = grid.grid[cell.rIdx + numEmptyCellsNeeded][cell.cIdx]
    const nextCellTicket = nextCell.data

    if (nextCellTicket && !isTicketDragTicket(nextCellTicket, dragTicket)) {
      return false
    }

    numEmptyCellsNeeded -= 1
  }

  return true
}
