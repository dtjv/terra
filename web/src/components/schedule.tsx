import * as React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { Flex, Grid, GridItem } from '@chakra-ui/react'

import type { ScheduleMatrix, ColHeader } from '@/types/types'
import { ScheduleColHeader } from '@/components/schedule-col-header'

// TODO: where do i put these? should they be configurable?
const COL_WIDTH = '100px'
const ROW_HEIGHT = '60px'

const useTickets = () => {
  return useQuery<ScheduleMatrix, Error>(
    ['tickets'],
    async () => {
      return (await axios.get('/api/schedule/')).data
    },
    {
      refetchInterval: 1000 * 60,
      refetchIntervalInBackground: true,
    }
  )
}

export const Schedule: React.FC = () => {
  // TODO: do i need `isFetching`?
  const { data, isLoading } = useTickets()
  const rowHeaders = data ? data.rowHeaders : []
  const colHeaders = data ? data.colHeaders : []
  const templateCols = `repeat(${colHeaders.length}, minmax(${COL_WIDTH}, 1fr))`
  const templateRows = `repeat(${rowHeaders.length}, minmax(${ROW_HEIGHT}, 1fr))`

  if (isLoading) return <div>loading...</div>

  return (
    <Flex p={8} align="center" justify="center">
      <Grid templateRows={templateRows} templateColumns={templateCols}>
        {colHeaders.map((colHeader: ColHeader) => {
          return (
            <GridItem
              key={colHeader.data?.id}
              borderBottomWidth="1px"
              borderBottomColor="gray.600"
            >
              <ScheduleColHeader>{colHeader.display}</ScheduleColHeader>
            </GridItem>
          )
        })}
      </Grid>
    </Flex>
  )
}
/*
import * as React from 'react'
import { Flex, Grid, GridItem } from '@chakra-ui/react'

import { Cell } from '@/components/cell'
import { ColHeader } from '@/components/headers'

const COL_WIDTH = '100px'
const ROW_HEIGHT = '60px'

export const Schedule = () => {
  // TODO: needs to call api to get data.
  const numRows = grid.grid.length
  const numCols = grid.grid[0].length
  const templateCols = `repeat(${numCols}, minmax(${COL_WIDTH}, 1fr))`
  const templateRows = `repeat(${numRows}, minmax(${ROW_HEIGHT}, 1fr))`

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
              <ColHeader>{column.data.display}</ColHeader>
            </GridItem>
          )
        })}
        {grid.grid.slice(1).map((row) => {
          return row.map((cell) => (
            <Cell key={`${cell.rIdx}-${cell.cIdx}`} cell={cell} grid={grid} />
          ))
        })}
      </Grid>
    </Flex>
  )
}
*/
