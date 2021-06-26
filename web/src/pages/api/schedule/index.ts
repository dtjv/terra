import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import type { AppData, Grid } from '@/types/types'
import { getData } from '@/lib/db'
import {
  makeTimeRangeListForDate,
  makeTimeDataList,
  makeGrid,
  makeDataCells,
  makeRowHeaders,
  makeColHeaders,
  computeTicketFields,
} from '@/lib/utils'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/schedule`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<Grid | string>
) => {
  if (req.method === 'GET') {
    const data: AppData | undefined = await getData()

    if (!data) {
      return res.status(500).send('Failed to read data')
    }

    const timeRangeList = makeTimeRangeListForDate()
    const timeDataList = makeTimeDataList(
      timeRangeList,
      data?.schedule.timeIntervalInMinutes
    )
    const rowHeaders = makeRowHeaders(timeDataList)
    const colHeaders = makeColHeaders(data.vehicles)
    const dataCells = makeDataCells({
      tickets: computeTicketFields(data.tickets),
      rowHeaders,
      colHeaders,
    })
    const grid = makeGrid({
      rows: rowHeaders,
      cols: colHeaders,
      cells: dataCells,
      timeIntervalInMinutes: data.schedule.timeIntervalInMinutes,
    })

    return res.status(200).json(grid)
  }
  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
