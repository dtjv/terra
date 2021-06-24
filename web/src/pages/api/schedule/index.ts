import type { NextApiRequest, NextApiResponse } from 'next'

import { getData } from '../../../lib/db'
import {
  generateTimeRange,
  generateTimeList,
  generateDataCells,
  generateGrid,
} from '../../../lib/utils'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/schedule`
//------------------------------------------------------------------------------
export default async (req: NextApiRequest, res: NextApiResponse<Grid>) => {
  if (req.method === 'GET') {
    const data = await getData()

    if (!data) {
      return res.status(500).send('Failed to read data')
    }

    const { schedule, tickets, vehicles } = data
    const { startTime, endTime, intervalInMinutes } = schedule
    const range = generateTimeRange({ startTime, endTime, intervalInMinutes })
    const times = generateTimeList(range)
    const cells = generateDataCells(times, vehicles, tickets)
    const grid = {
      rowHeaders: times,
      colHeaders: vehicles,
      data: cells, // <-- do i even use this?
      grid: generateGrid({
        data: cells,
        rowHeaders: times,
        colHeaders: [{ id: '', display: '' }, ...vehicles],
      }),
      intervalInMinutes,
    }

    return res.status(200).json({ grid })
  }
  return res.status(404).send(`Unsupported method: ${req.method}`)
}
