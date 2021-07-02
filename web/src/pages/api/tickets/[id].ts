import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import type { TicketData } from '@/types/types'
import { updateTicket } from '@/lib/db'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/tickets/:ticketid`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TicketData | string>
) => {
  if (req.method === 'PATCH') {
    const updatedTicket = await updateTicket(req.body.updatedTicket)

    return updatedTicket
      ? res.status(200).json(updatedTicket)
      : res.status(204).send(`No ticket to update`)
  }
  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
