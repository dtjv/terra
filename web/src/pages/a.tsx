import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

import { trucks, enhancedTickets } from "../data";

function renderColHeaders(columnHeaders) {
  const headers = [{ id: "colspacer", name: "" }, ...columnHeaders];

  return headers.map((header) => (
    <GridItem key={header.id}>
      <Flex align="center" justify="center" h="50">
        {header.name}
      </Flex>
    </GridItem>
  ));
}

function renderTickets() {
  return enhancedTickets.map((ticket) => (
    <GridItem
      key={ticket.id}
      colStart={ticket.x}
      rowStart={ticket.y}
      rowSpan={ticket.span}
      bg="papayawhip"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex align="center" color="gray.800" justify="center" minH="50px">
        {ticket.id}
      </Flex>
    </GridItem>
  ));
}

function renderEmptyCells() {
  const numEmpty = 4 * 8 - enhancedTickets.length;
  const empty = [];

  for (let i = 0; i < numEmpty; i += 1) {
    empty.push(
      <GridItem key={`e${i}`}>
        <Box minH="50px" bg="pink.50" />
      </GridItem>
    );
  }
  return empty;
}

export default function A() {
  const numCols = trucks.length + 1;
  const numRows = 8;

  return (
    <Box w="100%" p={8}>
      <Grid
        templateColumns={`repeat(${numCols}, minmax(100px, 1fr))`}
        templateRows={`repeat(${numRows}, minmax(50px, 1fr))`}
        gap={2}
      >
        {renderColHeaders(trucks)}
        {renderTickets()}
        {renderEmptyCells()}
      </Grid>
    </Box>
  );
}
