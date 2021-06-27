import * as React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

const useTickets = () => {
  return useQuery(
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
  const { data, isLoading, isFetching } = useTickets()

  if (isLoading) return <div>loading...</div>

  return (
    <div>
      <h1> schedule</h1>
      <p>{data ? 'got data! check console.' : 'no data'}</p>
      <p>{isFetching ? 'fetching...' : ''}</p>
    </div>
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
