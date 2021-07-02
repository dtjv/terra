import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import type { ScheduleData } from '@/types/types'
import { readData } from '@/lib/db'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/schedule`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ScheduleData | string>
) => {
  if (req.method === 'GET') {
    const scheduleConfig = await readData<ScheduleData>(
      'src/data/schedule-config.json'
    )

    if (!scheduleConfig) {
      return res.status(500).send('Failed to read schedule configuration')
    }

    return res.status(200).json(scheduleConfig)
  }
  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
