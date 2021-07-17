import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { updateTicket } from '@/lib/db'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/tickets/:id`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const ticketId = req.query['id'] ?? ''

  if (Array.isArray(ticketId)) {
    return res.status(400).send(`Invalid ticket id type: '${ticketId}'`)
  }

  if (req.method === 'PATCH') {
    try {
      const updatedTicket = await updateTicket(ticketId, req.body.updatedTicket)
      return res.status(200).json(updatedTicket)
    } catch (error) {
      return res.status(500).send(`Failed to update ticket: '${ticketId}'`)
    }
  }

  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
