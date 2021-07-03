import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { readData } from '@/lib/db'
import type { TicketData } from '@/types/types'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/tickets`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TicketData[] | string>
) => {
  if (req.method === 'GET') {
    const ticketData = await readData<TicketData[]>('src/data/tickets.json')

    if (!ticketData) {
      return res.status(500).send('Failed to read ticket data')
    }

    return res.status(200).json(ticketData)
  }
}

export default handler
