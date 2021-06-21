import * as React from "react";
import { Flex, Grid, GridItem } from "@chakra-ui/react";

import { Cell } from "@/components/x-cell";
import { grid } from "../data/x-data";

const COL_WIDTH = "100px";
const ROW_HEIGHT = "50px";

export const XSchedule = () => {
  const numRows = grid.grid.length;
  const numCols = grid.grid[0].length;
  const templateCols = `repeat(${numCols}, minmax(${COL_WIDTH}, 1fr))`;
  const templateRows = `repeat(${numRows}, minmax(${ROW_HEIGHT}, 1fr))`;

  return (
    <Flex p={8} align="center" justify="center">
      <Grid templateRows={templateRows} templateColumns={templateCols}>
        {grid.grid[0].map((column) => {
          return (
            <GridItem
              key={`${column.rIdx}-${column.cIdx}`}
              borderBottomWidth="1px"
              borderBottomColor="gray.600"
            >
              <Flex align="center" justify="center">
                {column.data.display}
              </Flex>
            </GridItem>
          );
        })}
        {grid.grid.slice(1).map((row) => {
          return row.map((cell) => (
            <Cell key={`${cell.rIdx}-${cell.cIdx}`} cell={cell} grid={grid} />
          ));
        })}
      </Grid>
    </Flex>
  );
};
