import { Box } from "@chakra-ui/react";
import { useDrag } from "react-dnd";

export const Ticket = ({ ticket, timeInterval }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "TICKET",
      item: ticket,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [ticket]
  );
  const height = (ticket.duration / timeInterval) * 50 - 5;

  return (
    <Box
      ref={dragRef}
      position="absolute"
      bg="papayawhip"
      w="85%"
      h={`${height}px`}
      color="gray.900"
      borderRadius="4px"
      zIndex="10"
      cursor="move"
      opacity={isDragging ? 0.5 : 1}
    >
      <Box pl={2} pt={1} lineHeight="1">
        <Box fontSize="xs" fontWeight="bold">
          {ticket.id}
        </Box>
        <Box fontSize="xs" color="gray.700">
          {ticket.range}
        </Box>
      </Box>
    </Box>
  );
};
