import * as React from "react";
import { useTable } from "react-table";
import { Flex, Grid, GridItem } from "@chakra-ui/react";

import { RowHeader } from "@/components/row-header";
import { Ticket } from "@/components/ticket";

export const Schedule = ({ grid, headers, table }) => {
  const data = React.useMemo(() => table, []);
  const columns = React.useMemo(() => headers, []);
  const { headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Flex p={8} align="center" justify="center">
      <Grid
        templateRows={grid.templateRows}
        templateColumns={grid.templateCols}
      >
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) => (
            <GridItem
              {...column.getHeaderProps()}
              borderBottomWidth="1px"
              borderBottomColor="gray.600"
            >
              <Flex align="center" justify="center">
                {column.render("header")}
              </Flex>
            </GridItem>
          ))
        )}
        {rows.map((row, rIdx) => {
          prepareRow(row);
          return row.cells.map((cell, cIdx, cells) => (
            <GridItem
              {...cell.getCellProps()}
              sx={{
                position: "relative",
                ...(rIdx % 2 != 0 && rIdx != rows.length - 1
                  ? {
                      borderBottomWidth: "1px",
                      borderBottomColor: "gray.600",
                    }
                  : {}),
                ...(cIdx < cells.length - 1
                  ? {
                      borderRightWidth: "1px",
                      borderRightColor: "gray.600",
                    }
                  : {}),
              }}
            >
              {cell.render(({ value }) => {
                if (cIdx === 0) {
                  return <RowHeader>{value}</RowHeader>;
                }

                if (value["ticket"]) {
                  return (
                    <Ticket
                      ticket={value["ticket"]}
                      timeInterval={value["timeInterval"]}
                    />
                  );
                }

                return <div />;
              })}
            </GridItem>
          ));
        })}
      </Grid>
    </Flex>
  );
};
