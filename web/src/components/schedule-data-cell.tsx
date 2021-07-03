import * as React from 'react'
import { useDrop } from 'react-dnd'
import { GridItem } from '@chakra-ui/react'
import type { UseMutationResult } from 'react-query'
import { Ticket } from '@/components/ticket'
import {
  getPreviousCellWithTicket,
  isCellCoveredByTicket,
  isSpaceForTicketAtCell,
} from '@/lib/utils'
import { CellKind, DragItem } from '@/constants/constants'
import type { Cell, Row, TicketData, TicketContext } from '@/types/types'

export type ScheduleDataCellProps = {
  cell: Cell
  rows: Row[]
  timeBlockInMinutes: number
  updateTicket: UseMutationResult<TicketData, Error, TicketData, TicketContext>
}

export const ScheduleDataCell: React.FC<ScheduleDataCellProps> = ({
  cell,
  rows,
  updateTicket,
  timeBlockInMinutes,
}) => {
  const numRows = rows.length
  const numCols = rows[0]?.cells.length ?? 0
  const [, dropRef] = useDrop(
    () => ({
      accept: DragItem.TICKET,
      canDrop: (dragTicket: TicketData, monitor) => {
        if (cell.kind !== CellKind.DATA_CELL) {
          return false
        }

        if (!monitor.isOver()) {
          return false
        }

        // if cell has a ticket, check if ticket is the one moving
        const cellTicket = cell.ticket
        if (cellTicket) {
          return cellTicket.id === dragTicket.id
        }

        // cell has no ticket. check if a previous cell has a ticket.
        const prevCellWithTicket = getPreviousCellWithTicket(cell, rows)
        if (!prevCellWithTicket) {
          return true
        }

        // check if cell is covered by a previous cell's ticket.
        if (
          prevCellWithTicket.kind === CellKind.DATA_CELL &&
          isCellCoveredByTicket({
            cell,
            prevCell: prevCellWithTicket,
            timeBlockInMinutes,
          })
        ) {
          const prevTicket = prevCellWithTicket.ticket

          // check if previous ticket is the one moving
          if (prevTicket?.id === dragTicket.id) {
            return isSpaceForTicketAtCell({
              ticket: dragTicket,
              targetCell: cell,
              rows,
              timeBlockInMinutes,
            })
          }
        } else {
          return isSpaceForTicketAtCell({
            ticket: dragTicket,
            targetCell: cell,
            rows,
            timeBlockInMinutes,
          })
        }

        return false
      },
      drop: (dragTicket: TicketData) => {
        if (cell.kind === CellKind.DATA_CELL) {
          updateTicket.mutate({
            ...dragTicket,
            vehicleId: cell.colHeader.vehicleId,
            scheduledDateTimeISO: cell.rowHeader.scheduleTimeISO,
          })
        }
      },
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [cell, rows, timeBlockInMinutes]
  )

  if (cell.kind !== CellKind.DATA_CELL) return null

  return (
    <GridItem
      ref={dropRef}
      sx={{
        position: 'relative',
        ...(cell.rowIdx % 2 === 0 && cell.rowIdx < numRows - 1
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
      <Ticket ticket={cell.ticket} timeBlockInMinutes={timeBlockInMinutes} />
    </GridItem>
  )
}
