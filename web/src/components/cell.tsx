import { useDrop } from 'react-dnd'
import { GridItem } from '@chakra-ui/react'

import { RowHeader } from '@/components/row-header'
import { Ticket } from '@/components/ticket'
import {
  isTicketDragTicket,
  getPreviousCellWithTicket,
  isCellCovered,
  checkForEmptyCells,
} from '@/data/utils'

interface DragItem {
  type: string
  id: string
  time: string
  truck: string
  duration: number
  range: string
  status: string
}

export const Cell = ({ cell, grid }) => {
  const makeDndSpec = () => ({
    accept: 'TICKET',
    canDrop: (dragTicket: DragItem, monitor) => {
      if (dragTicket.status === 'PROCESSING') {
        return false
      }

      if (!monitor.isOver()) {
        return false
      }

      const cellTicket = cell.data

      // if cell has a ticket, check if ticket is the one moving
      if (cellTicket) {
        return isTicketDragTicket(cellTicket, dragTicket)
      }

      // cell has no ticket. check if a previous cell has a ticket.
      const prevCell = getPreviousCellWithTicket(cell, grid.grid)
      if (!prevCell) {
        return true
      }

      // check if cell is covered by a previous cell's ticket.
      if (isCellCovered(cell, prevCell, grid.intervalInMinutes)) {
        const prevCellTicket = prevCell.data

        if (isTicketDragTicket(prevCellTicket, dragTicket)) {
          return checkForEmptyCells(dragTicket, cell, grid)
        }
      } else {
        return checkForEmptyCells(dragTicket, cell, grid)
      }

      return false
    },
  })

  const [_, dropRef] = useDrop(makeDndSpec, [cell])
  const numRows = grid.grid.length
  const numCols = grid.grid[0].length

  return (
    <GridItem
      ref={dropRef}
      sx={{
        position: 'relative',
        ...(cell.rIdx % 2 !== 0 && cell.rIdx < numRows - 1
          ? {
              borderBottomWidth: '1px',
              borderBottomColor: 'gray.600',
            }
          : {}),
        ...(cell.cIdx < numCols - 1
          ? {
              borderRightWidth: '1px',
              borderRightColor: 'gray.600',
            }
          : {}),
      }}
    >
      {cell.type === 'HEADER' ? (
        <RowHeader height={cell.data.display ? 'auto' : '4'}>
          {cell.data.display}
        </RowHeader>
      ) : cell.type === 'DATA' && cell.data ? (
        <Ticket ticket={cell.data} timeInterval={grid.intervalInMinutes} />
      ) : (
        <div />
      )}
    </GridItem>
  )
}
