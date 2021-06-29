import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import type { AppData, ScheduleMatrix } from '@/types/types'
import { getData } from '@/lib/db'
import {
  makeTimeRangeListForDate,
  makeTimeDataList,
  makeCells,
  makeRowHeaders,
  makeColHeaders,
  computeTicketFields,
} from '@/lib/utils'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/schedule`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ScheduleMatrix | string>
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
    const cells = makeCells({
      tickets: computeTicketFields(data.tickets),
      rowHeaders,
      colHeaders,
    })
    const scheduleMatrix: ScheduleMatrix = {
      rowHeaders,
      colHeaders,
      cells,
      timeIntervalInMinutes: data.schedule.timeIntervalInMinutes,
    }

    return res.status(200).json(scheduleMatrix)
  }
  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
