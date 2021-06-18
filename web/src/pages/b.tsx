import * as React from "react";
import { useTable } from "react-table";
import { Flex, Table, Tr, Td, Thead, Tbody, Th } from "@chakra-ui/react";

export default function B() {
  const data = React.useMemo(
    () => [
      {
        col1: "8 AM",
        col2: "A",
        col3: "",
      },
      {
        col1: "9 AM",
        col2: "",
        col3: "",
      },
      {
        col1: "10 AM",
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <Flex p={8} align="center" justify="center">
      <Table
        variant="simple"
        {...getTableProps()}
        sx={{ tableLayout: "fixed" }}
      >
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <Th
                  {...column.getHeaderProps()}
                  sx={{
                    width: `${i === 0 ? "40px" : "100px"}`,
                  }}
                >
                  {column.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return (
                    <Td
                      {...cell.getCellProps()}
                      h="60px"
                      sx={{
                        ps: `${i === 0 ? ".5rem" : "1.5rem"}`,
                        pe: `${i === 0 ? "1rem" : "1.5rem"}`,
                        textAlign: `${i === 0 ? "end" : "start"}`,
                        //width: `${i === 0 ? "65px" : "85px"}`,
                        fontWeight: `${i == 0 ? "bold" : "normal"}`,
                        fontSize: `${i == 0 ? "xs" : "md"}`,
                        color: `${i === 0 ? "gray.400" : "whiteAlpha.900"}`,
                      }}
                      borderRightWidth={
                        i === row.cells.length - 1 ? "0" : "1px"
                      }
                    >
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
}
