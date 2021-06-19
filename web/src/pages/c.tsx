import * as React from "react";
import { useTable } from "react-table";
import { Flex, Grid, GridItem } from "@chakra-ui/react";

import { RowHeader } from "@/components/row-header";
import { Ticket } from "@/components/ticket";

import { colHeaders, tableData } from "../data";

export default function C() {
  const grid = {
    rowCount: tableData.length + 1,
    colCount: colHeaders.length,
    colWidth: "100px",
    rowHeight: "50px",
  };
  const data = React.useMemo(() => tableData, []);
  const columns = React.useMemo(() => colHeaders, []);
  const { headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Flex p={8} align="center" justify="center">
      <Grid
        templateColumns={`repeat(${grid.colCount}, minmax(${grid.colWidth}, 1fr))`}
        templateRows={`repeat(${grid.rowCount}, minmax(${grid.rowHeight}, 1fr))`}
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
          return row.cells.map((cell, cIdx, cells) => {
            return (
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
                {cell.render((args) => {
                  if (cIdx === 0) {
                    return <RowHeader>{args.value}</RowHeader>;
                  }

                  if (args.value["ticket"]) {
                    return (
                      <Ticket
                        ticket={args.value["ticket"]}
                        timeInterval={args.value["timeInterval"]}
                      />
                    );
                  }

                  return <div />;
                })}
              </GridItem>
            );
          });
        })}
      </Grid>
    </Flex>
  );
}
