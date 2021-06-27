import * as React from 'react'
import { useDrop } from 'react-dnd'
import { GridItem } from '@chakra-ui/react'

import { Ticket } from '@/components/ticket'
import {
  getPreviousCellWithTicket,
  isCellCoveredByTicket,
  isSpaceForTicketAtCell,
} from '@/lib/utils'

import type { TicketData, Cell, ScheduleMatrix } from '@/types/types'

export interface ScheduleCellProps {
  cell: Cell
  matrix: ScheduleMatrix
}

export const ScheduleCell: React.FC<ScheduleCellProps> = ({ cell, matrix }) => {
  const [, dropRef] = useDrop(
    () => ({
      accept: 'TICKET',
      canDrop: (dragTicket: TicketData, monitor) => {
        if (!monitor.isOver()) {
          return false
        }

        const cellTicket = cell.data

        // if cell has a ticket, check if ticket is the one moving
        if (cellTicket) {
          return cellTicket.id === dragTicket.id
        }

        // cell has no ticket. check if a previous cell has a ticket.
        const prevCell = getPreviousCellWithTicket(cell, matrix)
        if (!prevCell) {
          return true
        }

        // check if cell is covered by a previous cell's ticket.
        if (
          isCellCoveredByTicket(cell, prevCell, matrix.timeIntervalInMinutes)
        ) {
          const prevCellTicket = prevCell.data

          if (prevCellTicket?.id === dragTicket.id) {
            return isSpaceForTicketAtCell(dragTicket, cell, matrix)
          }
        } else {
          return isSpaceForTicketAtCell(dragTicket, cell, matrix)
        }

        return false
      },
    }),
    [cell]
  )
  const numRows = matrix.cells.length
  const numCols = matrix.cells[0]?.length ?? 0

  return (
    <GridItem
      ref={dropRef}
      sx={{
        position: 'relative',
        ...(cell.rowIdx % 2 !== 0 && cell.rowIdx < numRows - 1
          ? {
              borderBottomWidth: '1px',
              borderBottomColor: 'gray.600',
            }
          : {}),
        ...(cell.colIdx < numCols - 1
          ? {
              borderRightWidth: '1px',
              borderRightColor: 'gray.600',
            }
          : {}),
      }}
    >
      {cell.data ? (
        <Ticket
          ticket={cell.data}
          timeIntervalInMinutes={matrix.timeIntervalInMinutes}
        />
      ) : null}
    </GridItem>
  )
}
