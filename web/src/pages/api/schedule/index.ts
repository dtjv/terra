import { add } from 'date-fns'
import { getTickets } from '@/lib/db'
import { makeTime } from '@/lib/utils'
import { SCHEDULE_START_HOUR_IN_24HR } from '@/config/constants'
import { toTicket } from '@/types/utils'
import type { Ticket, TicketDocument } from '@/types/types'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

interface RequestData {
  vehicleKeys: string[]
  requestDate: Date
  requestTime: string
}

type RequestDates = Pick<RequestData, 'requestDate' | 'requestTime'>

//------------------------------------------------------------------------------
// Handler for api calls to `/api/schedule`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const { vehicleKeys, requestDate, requestTime }: RequestData = req.body

    if (!vehicleKeys.length || !requestDate || !requestTime) {
      return res.status(400).send(`Request is missing expected values`)
    }

    const requestDates: RequestDates[] = [
      { requestDate: new Date(requestDate), requestTime },
    ]
    requestDates.push({
      requestDate: add(new Date(requestDate), { days: 1 }),
      requestTime: makeTime(SCHEDULE_START_HOUR_IN_24HR),
    })
    requestDates.push({
      requestDate: add(new Date(requestDate), { days: 2 }),
      requestTime: makeTime(SCHEDULE_START_HOUR_IN_24HR),
    })

    interface TicketsByRequest {
      tickets: Ticket[]
      requestDate: Date
      requestTime: string
    }
    const ticketsByScheduledAt: { [key: string]: TicketsByRequest } = {}

    for (const requestItem of requestDates) {
      try {
        const ticketDocs: TicketDocument[] = await getTickets({
          vehicleKey: { $in: vehicleKeys },
          scheduledAt: requestItem.requestDate,
          scheduledTime: { $gt: requestTime },
        })

        ticketsByScheduledAt[requestItem.requestDate.toISOString()] = {
          tickets: ticketDocs.map((ticketDoc) => toTicket(ticketDoc)),
          ...requestItem,
        }
      } catch (error) {
        console.error(error)
      }
    }

    console.log('ticketsByScheduledAt', ticketsByScheduledAt)

    return res.status(200).json(ticketsByScheduledAt)
  }

  return res.status(404).send(`Unsupported request method: ${req.method}`)
}

export default handler
