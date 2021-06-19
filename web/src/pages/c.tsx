import * as React from "react";
import { useTable } from "react-table";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

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
                  return (
                    <Box
                      sx={
                        cIdx === 0
                          ? {
                              position: "absolute",
                              backgroundColor: "gray.800",
                              top: "-.84rem",
                              right: "1rem",
                              width: "100%",
                            }
                          : args.value
                          ? {
                              position: "absolute",
                              backgroundColor: "papayawhip",
                              height: "190%",
                              width: "85%",
                              color: "black",
                              borderTopRightRadius: "3px",
                              borderBottomRightRadius: "3px",
                              borderBottomLeftRadius: "3px",
                            }
                          : {}
                      }
                    >
                      <Flex
                        sx={
                          cIdx === 0
                            ? {
                                flexDirection: "column",
                                alignItems: "flex-end",
                                marginRight: "10px",
                              }
                            : {
                                alignItems: "center",
                              }
                        }
                      >
                        <div>{args.value}</div>
                      </Flex>
                    </Box>
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
