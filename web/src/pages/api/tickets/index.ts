import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { add, format } from 'date-fns'
import { getTickets, createTicket } from '@/lib/db'
import { toTicket } from '@/types/utils'
import type { Ticket, TicketDocument } from '@/types/types'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/tickets`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    const { scheduledAt } = req.query

    if (!scheduledAt || Array.isArray(scheduledAt)) {
      return res
        .status(400)
        .json({ message: `Missing/Invalid query parameter 'scheduledAt'` })
    }

    try {
      const ticketDocs: TicketDocument[] = await getTickets({
        scheduledAt: {
          $gte: new Date(format(new Date(scheduledAt), 'yyyy-M-d')),
          $lt: new Date(
            format(add(new Date(scheduledAt), { days: 1 }), 'yyyy-M-d')
          ),
        },
      })

      const tickets: Ticket[] = ticketDocs.map((ticketDoc) =>
        toTicket(ticketDoc)
      )
      return res.status(200).json(tickets)
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to fetch tickets.', error })
    }
  }

  if (req.method === 'POST') {
    const { newTicket } = req.body

    try {
      const ticketDoc: TicketDocument = await createTicket(newTicket)
      return res.status(200).json(toTicket(ticketDoc))
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to create ticket.', error })
    }
  }

  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
