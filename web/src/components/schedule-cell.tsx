import * as React from 'react'
import { useDrop } from 'react-dnd'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { GridItem } from '@chakra-ui/react'

import { Ticket } from '@/components/ticket'
import {
  getPreviousCellWithTicket,
  isCellCoveredByTicket,
  isSpaceForTicketAtCell,
} from '@/lib/utils'

import { CellKind } from '@/types/types'
import type {
  TicketData,
  Cell,
  ScheduleMatrix,
  UpdatedTicketData,
} from '@/types/types'

const updateTicket = (
  updatedTicket: UpdatedTicketData
): Promise<TicketData> => {
  return axios.patch(`/api/tickets`, { updatedTicket })
}

export interface ScheduleCellProps {
  cell: Cell
  matrix: ScheduleMatrix
}

export const ScheduleCell: React.FC<ScheduleCellProps> = ({ cell, matrix }) => {
  const queryClient = useQueryClient()
  const updateTicketMutation = useMutation(updateTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries('schedule')
    },
  })
  const [, dropRef] = useDrop(
    () => ({
      accept: 'TICKET',
      canDrop: (dragTicket: TicketData, monitor) => {
        if (cell.data.kind !== CellKind.DATA_CELL) {
          return false
        }

        if (!monitor.isOver()) {
          return false
        }

        // if cell has a ticket, check if ticket is the one moving
        const cellTicket = cell.data.ticket
        if (cellTicket) {
          return cellTicket.id === dragTicket.id
        }

        // cell has no ticket. check if a previous cell has a ticket.
        const prevCellWithTicket = getPreviousCellWithTicket(cell, matrix.cells)
        if (!prevCellWithTicket) {
          return true
        }

        // check if cell is covered by a previous cell's ticket.
        if (
          prevCellWithTicket.data.kind === CellKind.DATA_CELL &&
          isCellCoveredByTicket({
            cell,
            prevCell: prevCellWithTicket,
            timeIntervalInMinutes: matrix.timeIntervalInMinutes,
          })
        ) {
          const prevTicket = prevCellWithTicket.data.ticket

          // check if previous ticket is the one moving
          if (prevTicket?.id === dragTicket.id) {
            return isSpaceForTicketAtCell({
              ticket: dragTicket,
              targetCell: cell,
              matrix,
            })
          }
        } else {
          return isSpaceForTicketAtCell({
            ticket: dragTicket,
            targetCell: cell,
            matrix,
          })
        }

        return false
      },
      drop: (dragTicket: TicketData) => {
        updateTicketMutation.mutate({
          ...dragTicket,
          scheduledDateTimeISO:
            matrix.rowHeaders[cell.rowIdx]?.originalDateTimeISO,
          vehicleId: matrix.colHeaders[cell.colIdx]?.id,
        })
      },
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [cell, matrix]
  )

  if (cell.data.kind !== CellKind.DATA_CELL) {
    return null
  }

  const numRows = matrix.cells.length
  const numCols = matrix.cells[0]?.length ?? 0

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
      <Ticket
        ticket={cell.data.ticket}
        timeIntervalInMinutes={matrix.timeIntervalInMinutes}
      />
    </GridItem>
  )
}
