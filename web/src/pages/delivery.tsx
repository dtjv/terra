import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

// TODO: must be fetched on client-side
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

// times = ['8:00 AM', ...]
// trucks = [ { id: '102' }, ... ]
//
// times & trucks = [row, col]
//
// tickets are random grid areas. useGrid should add to tickets their respective
// place in the grid (based on their data).
//
// const columns = [{ 'label': 'truck 102', accessor: 'col1' }]
//
// const data = [
//  {
//    'col1': { id: 'A', slot: "8:00 AM", truck: '102', duration: 30 }
//  }
// ]
//
// i'm trying to keep the grid construction as generic as possible - separated
// from app logic. i just want to render rows and columns. the mapping between
// app data and placement in grid must be isolated and separated from grid
// construction. hence `useGrid`.
//
//   <Grid>
//     {columns.map(column => <ColumnHeader column={column} />)
//     {rows.map(row => {
//       return row.cells.map(cell => {
//         <GridItem><Cell cell={cell} /></GridItem>
//       })
//     })}
//   </Grid>
//
// ticket = { id: "A", slot: "8:00 AM", truck: "102", duration: 30 },
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

function Delivery() {
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

/*
const headers = ["", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function Delivery() {
  return (
    <>
      <Box w="100%" p={8} mb={8}>
        <Grid templateColumns="repeat(8, 1fr)">
          {headers.map((header) => (
            <GridItem key={header}>
              <Flex align="center" justify="center" h="50">
                {header.toUpperCase()}
              </Flex>
            </GridItem>
          ))}

          {headers.map((_, idx) => (
            <GridItem key={idx}>
              <Box
                h="4"
                borderBottom="1px"
                borderBottomColor="gray.200"
                borderLeft="1px"
                borderLeftColor="gray.200"
                borderRight={idx === headers.length - 1 ? "1px" : 0}
                borderRightColor="gray.200"
              />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  );
}
*/

export default Delivery;
