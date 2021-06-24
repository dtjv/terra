import * as _ from 'lodash'
import { set, format, addMinutes } from 'date-fns'

export const generateTimeRange = ({
  startTime = 8,
  endTime = 18,
  date = new Date(Date.now()),
  intervalInMinutes = 30,
}) => {
  const range = []

  let day = set(date, {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDay(),
    hours: startTime,
    minutes: 0,
  })

  while (startTime < endTime) {
    range.push(day)
    day = addMinutes(day, intervalInMinutes)
    startTime = day.getHours()
  }

  return range
}

export const generateTimeList = (dateRange = [], intervalInMinutes = 30) =>
  dateRange.map((date, idx) => {
    const factor = 60 / intervalInMinutes
    return {
      id: format(date, 'h:mm a'),
      display: idx % factor !== 0 ? '' : format(date, 'h a'),
      original: date,
    }
  })

const groupTickets = (
  tickets = [],
  rowField = 'time',
  colField = 'truckId'
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

export const generateDataCells = (rows = [], cols = [], tickets = []) => {
  const ticketHash = groupTickets(tickets, 'time', 'truckId')

  return rows.map((row) => {
    return cols.map((col) => {
      const ticket = _.get(ticketHash, [row.id, col.id])

      return {
        type: 'DATA',
        data: ticket
          ? {
              ...ticket,
              range: `${format(row.original, 'h:mmaaa')} - ${format(
                addMinutes(row.original, ticket.duration),
                'h:mmaaa'
              )}`,
            }
          : undefined,
      }
    })
  })
}

export const generateGrid = ({
  rowHeaders = [],
  colHeaders = [],
  data = [],
}) => {
  const grid = data.map((row, rIdx) => {
    const cell = {
      rIdx: rIdx + 1,
      cIdx: 0,
      type: 'HEADER',
      data: rowHeaders[rIdx],
    }
    return [
      cell,
      ...row.map((cell, cIdx) => ({ rIdx: rIdx + 1, cIdx: cIdx + 1, ...cell })),
    ]
  })

  return [
    colHeaders.map((column, cIdx) => ({
      rIdx: 0,
      cIdx,
      type: 'HEADER',
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

export const isCellCovered = (cell, prevCell, intervalInMinutes) => {
  if (cell.data) {
    throw new Error('Cell has a ticket. Cannot test for covereage.')
  }

  const i = cell.rIdx - prevCell.rIdx
  return prevCell.data.duration / intervalInMinutes >= i + 1
}

export const isTicketDragTicket = (ticket, dragTicket) =>
  ticket.id === dragTicket.id

export const checkForEmptyCells = (dragTicket, cell, grid) => {
  // -1 for cell - we know its empty
  let numEmptyCellsNeeded = dragTicket.duration / grid.intervalInMinutes - 1

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
