import type { NextApiRequest, NextApiResponse } from 'next'
import type { Grid, ScheduleConfig, Ticket, Vehicle } from '../../../types'

import { getData } from '../../../lib/db'
import { makeGrid, makeTimes, makeDateRange } from '../../../lib/utils'

interface Data {
  schedule: ScheduleConfig
  tickets: Ticket[]
  vehicles: Vehicle[]
}

//------------------------------------------------------------------------------
// Handler for api calls to `/api/schedule`
//------------------------------------------------------------------------------
export default async (
  req: NextApiRequest,
  res: NextApiResponse<Grid | string>
) => {
  if (req.method === 'GET') {
    const data: Data = await getData()

    if (!data) {
      return res.status(500).send('Failed to read data')
    }

    const { schedule, tickets, vehicles } = data
    const { timeIntervalInMinutes } = schedule

    const times = makeTimes(makeDateRange(), timeIntervalInMinutes)
    const grid: Grid = {
      cells: makeGrid(times, vehicles, tickets),
      timeIntervalInMinutes,
    }

    return res.status(200).json(grid)
  }
  return res.status(404).send(`Unsupported method: ${req.method}`)
}
