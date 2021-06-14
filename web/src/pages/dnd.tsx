import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function One() {
  const headers = days.map((day) => (
    <GridItem key={day}>
      <Flex align="center" justify="center" h="100" bg="gray.200">
        {day.toUpperCase()}
      </Flex>
    </GridItem>
  ));

  const spacer = [
    <GridItem key="spacer">
      <Box h="100" bg="gray.200"></Box>
    </GridItem>,
  ];

  return <>{[...spacer, ...headers]}</>;
}

function DnD() {
  return (
    <>
      <Box w="100%" p={8} mb={8}>
        <Grid templateColumns="repeat(8, 1fr)">
          <One />
        </Grid>
      </Box>
    </>
  );
}

export default DnD;
