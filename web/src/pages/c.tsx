import * as React from "react";
import { useTable } from "react-table";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

export default function C() {
  const data = React.useMemo(
    () => [
      {
        col1: "8 AM",
        col2: "A",
        col3: "",
      },
      {
        col1: "",
        col2: "",
        col3: "",
      },
      {
        col1: "9 AM",
        col2: "",
        col3: "",
      },
      {
        col1: "",
        col2: "",
        col3: "",
      },
      {
        col1: "10 AM",
        col2: "",
        col3: "",
      },
      {
        col1: "",
        col2: "",
        col3: "",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "col1",
      },
      {
        Header: "Truck 102",
        accessor: "col2",
      },
      {
        Header: "Truck 202",
        accessor: "col3",
      },
    ],
    []
  );

  const { headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Flex p={8} align="center" justify="center">
      <Grid
        templateColumns={`repeat(3, minmax(100px, 1fr))`}
        templateRows={`repeat(7, minmax(50px, 1fr))`}
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
          return row.cells.map((cell, cIdx) => {
            return (
              <GridItem
                key={cIdx * cIdx}
                {...cell.getCellProps()}
                position="relative"
                sx={
                  rIdx % 2 != 0 && rIdx != rows.length - 1
                    ? {
                        borderBottomWidth: "1px",
                        borderBottomColor: "gray.600",
                      }
                    : {}
                }
              >
                <Box
                  w="100%"
                  h="1rem" // maybe take out?
                  sx={
                    cIdx === 0
                      ? {
                          position: "absolute",
                          backgroundColor: "gray.800",
                          top: "-.84rem",
                          right: "1rem",
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
                    {cell.render("Cell")}
                  </Flex>
                </Box>
              </GridItem>
            );
          });
        })}
      </Grid>
    </Flex>
  );
}
