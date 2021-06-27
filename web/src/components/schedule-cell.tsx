import * as React from 'react'
import { useDrop } from 'react-dnd'
import { GridItem } from '@chakra-ui/react'

import type { TicketData, DataCell, Grid } from '@/types/types'
//import { RowHeader } from '@/components/headers'
//import { Ticket } from '@/components/ticket'
import {
  getPreviousCellWithTicket,
  isCellCoveredByTicket,
  isSpaceForTicketAtCell,
} from '@/lib/utils'

export interface CellProps {
  cell: DataCell
  grid: Grid
}

export const Cell: React.FC<CellProps> = ({ cell, grid }) => {
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
        const prevCell = getPreviousCellWithTicket(cell, grid)
        if (!prevCell) {
          return true
        }

        // check if cell is covered by a previous cell's ticket.
        if (isCellCoveredByTicket(cell, prevCell, grid.timeIntervalInMinutes)) {
          const prevCellTicket = prevCell.data

          if (prevCellTicket.id === dragTicket.id) {
            return isSpaceForTicketAtCell(dragTicket, cell, grid)
          }
        } else {
          return isSpaceForTicketAtCell(dragTicket, cell, grid)
        }

        return false
      },
    }),
    [cell]
  )
  return (
    <GridItem ref={dropRef}>
      <div>cell</div>
    </GridItem>
  )
  /*
  const numRows = grid.cells.length
  const numCols = grid.cells[0]?.length ?? 0

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
      {cell.type === 'HEADER' ? (
        <RowHeader height={cell.data. ? 'auto' : '4'}>
          {cell.data.display}
        </RowHeader>
      ) : cell.type === 'DATA' && cell.data ? (
        <Ticket ticket={cell.data} timeInterval={grid.intervalInMinutes} />
      ) : (
        <div />
      )}
    </GridItem>
  )
*/
}
