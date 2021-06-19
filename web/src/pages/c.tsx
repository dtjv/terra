import * as React from "react";
import { useTable } from "react-table";
import { Flex, Grid, GridItem } from "@chakra-ui/react";

import { RowHeader } from "@/components/row-header";
import { Ticket } from "@/components/ticket";

import { tableCols, tableData } from "../data";

export default function C() {
  const data = React.useMemo(() => tableData, []);
  const columns = React.useMemo(() => tableCols, []);
  const { headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Flex p={8} align="center" justify="center">
      <Grid
        templateColumns={`repeat(4, minmax(100px, 1fr))`}
        templateRows={`repeat(21, minmax(50px, 1fr))`}
      >
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column, i) => (
            <GridItem
              key={i}
              {...column.getHeaderProps()}
              borderBottomWidth="1px"
              borderBottomColor="gray.600"
            >
              <Flex align="center" justify="center">
                {column.render("Header")}
              </Flex>
            </GridItem>
          ))
        )}
        {rows.map((row, rIdx) => {
          prepareRow(row);
          return row.cells.map((cell, cIdx, cells) => {
            return (
              <GridItem
                key={cIdx * cIdx}
                {...cell.getCellProps()}
                position="relative"
                sx={{
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
                  return cIdx === 0 ? (
                    <RowHeader>{args.value}</RowHeader>
                  ) : args.value ? (
                    <Ticket height="190">{args.value}</Ticket>
                  ) : (
                    <div />
                  );
                })}
              </GridItem>
            );
          });
        })}
      </Grid>
    </Flex>
  );
}
