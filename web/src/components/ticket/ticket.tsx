import { useDrag } from 'react-dnd'
import { Box, Flex } from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { DragItem } from '@/types/enums'
import type { Ticket } from '@/types/types'

export interface TicketViewProps {
  ticket: Ticket | undefined
  isPastSchedule: boolean
  timeBlockInMinutes: number
}

export const TicketView = ({
  ticket,
  isPastSchedule,
  timeBlockInMinutes,
}: TicketViewProps) => {
  const [{ canDrag, isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DragItem.TICKET,
      item: ticket,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        canDrag: !isPastSchedule,
      }),
    }),
    [ticket]
  )

  if (!ticket) return null

  const height = (ticket.durationInMinutes / timeBlockInMinutes) * 35 - 5

  return (
    <Box
      ref={dragPreviewRef}
      position="absolute"
      bg="gray.700"
      w="90%"
      h={`${height}px`}
      color="white"
      borderRadius="4px"
      overflow="hidden"
      opacity={isDragging ? 0.5 : 1}
      zIndex={isDragging ? -10 : 10}
    >
      <Box px={1} pt={1.5}>
        <Flex
          align="start"
          justify="space-between"
          fontSize="xs"
          fontWeight="bold"
        >
          {ticket.customerName}
          <div ref={dragRef}>
            {canDrag && <DragHandleIcon color="white" cursor="grab" />}
          </div>
        </Flex>
        {ticket.durationInMinutes > timeBlockInMinutes ? (
          <Box fontSize="xs" color="white">
            {ticket.scheduledTimeRange}
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
