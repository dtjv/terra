import * as React from 'react'
import { useDrag } from 'react-dnd'
import { Box, Flex } from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'
import type { TicketData } from '@/types/types'
import { DragItem, MIN_ROW_HEIGHT } from '@/constants/constants'

export type TicketProps = {
  ticket: TicketData | undefined
  timeBlockInMinutes: number
}

export const Ticket: React.FC<TicketProps> = ({
  ticket,
  timeBlockInMinutes,
}) => {
  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DragItem.TICKET,
      item: ticket,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [ticket]
  )

  if (!ticket) return null

  const height =
    (ticket.durationInMinutes / timeBlockInMinutes) * MIN_ROW_HEIGHT - 5

  return (
    <Box
      ref={dragPreviewRef}
      position="absolute"
      bg="papayawhip"
      w="85%"
      h={`${height}px`}
      color="gray.900"
      borderRadius="4px"
      opacity={isDragging ? 0.5 : 1}
      zIndex={isDragging ? -10 : 10}
    >
      <Box px={1} pt={1.5} lineHeight="1">
        <Flex
          align="start"
          justify="space-between"
          fontSize="xs"
          fontWeight="bold"
        >
          {ticket.id}
          <div ref={dragRef}>
            <DragHandleIcon color="gray.900" cursor="grab" />
          </div>
        </Flex>
        <Box fontSize="xs" color="gray.700">
          {ticket.timeRange}
        </Box>
      </Box>
    </Box>
  )
}
