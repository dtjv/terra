import * as React from 'react'
import { useDrag } from 'react-dnd'
import { Box, Flex } from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'

import type { TicketData } from '@/types/types'

export interface TicketProps {
  ticket: TicketData
  timeIntervalInMinutes: number
}

export const Ticket: React.FC<TicketProps> = ({
  ticket,
  timeIntervalInMinutes,
}) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'TICKET',
      item: ticket,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [ticket]
  )
  // TODO: replace magic numbers
  const height = (ticket.durationInMinutes / timeIntervalInMinutes) * 60 - 5

  return (
    <Box
      ref={dragRef}
      position="absolute"
      bg="papayawhip"
      w="85%"
      h={`${height}px`}
      color="gray.900"
      borderRadius="4px"
      opacity={isDragging ? 0.5 : 1}
      zIndex="10"
    >
      <Box px={1} pt={1.5} lineHeight="1">
        <Flex
          align="start"
          justify="space-between"
          fontSize="xs"
          fontWeight="bold"
        >
          {ticket.id}
          <DragHandleIcon color="gray.900" cursor="grab" />
        </Flex>
        <Box fontSize="xs" color="gray.700">
          {ticket.timeRange}
        </Box>
      </Box>
    </Box>
  )
}
