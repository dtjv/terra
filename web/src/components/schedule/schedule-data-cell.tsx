import { useDrop } from 'react-dnd'
import { GridItem, useColorModeValue } from '@chakra-ui/react'
import type { UseMutationResult } from 'react-query'
import { TicketView } from '@/components/ticket'
import {
  isMultipleOf,
  getPreviousCellWithTicket,
  isCellCoveredByTicket,
  isSpaceForTicketAtCell,
} from '@/lib/utils'
import { CellKind, DragItem } from '@/types/enums'
import type { Cell, Row, Ticket, TicketContext } from '@/types/types'

export interface ScheduleDataCellProps {
  cell: Cell
  rows: Row[]
  timeBlockInMinutes: number
  updateTicket: UseMutationResult<Ticket, Error, Ticket, TicketContext>
}

export const ScheduleDataCell = ({
  cell,
  rows,
  updateTicket,
  timeBlockInMinutes,
}: ScheduleDataCellProps) => {
  const numRows = rows.length + 1
  const numCols = rows[0]?.cells.length ?? 0
  const borderColor = useColorModeValue('gray.300', 'whiteAlpha.400')
  const showLineInGrid = isMultipleOf(cell.rowIdx, 60 / timeBlockInMinutes)
  const [, dropRef] = useDrop(
    () => ({
      accept: DragItem.TICKET,
      canDrop: (dragTicket: Ticket, monitor) => {
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
      drop: (dragTicket: Ticket) => {
        if (cell.kind === CellKind.DATA_CELL) {
          updateTicket.mutate({
            ...dragTicket,
            vehicleKey: cell.colHeader.key,
            scheduledAtISO: cell.rowHeader.scheduleTimeISO,
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
        ...{ borderColor },
        ...(showLineInGrid && cell.rowIdx < numRows - 2
          ? {
              borderBottomWidth: '1px',
            }
          : {}),
        ...(cell.colIdx < numCols - 1
          ? {
              borderRightWidth: '1px',
            }
          : {}),
      }}
    >
      <TicketView
        ticket={cell.ticket}
        timeBlockInMinutes={timeBlockInMinutes}
      />
    </GridItem>
  )
}
