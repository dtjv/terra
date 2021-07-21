import { connectToDB, createTicket } from '@/lib/db'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

export const makeTicket = async (): Promise<void> => {
  if (!(await connectToDB())) {
    console.error('failed to connect to db')
    process.exit(1)
  }

  const newTicket: TicketInput = {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'sally',
    destinationAddress: {
      street: '5924 mohawk dr',
      zip: '97301',
    },
    vehicleKey: '302',
    scheduledAt: new Date('2021-06-05T16:00:00.000Z'),
    durationInMinutes: 30,
  }

  const ticketDocument = await createTicket(newTicket)

  console.log(ticketDocument)

  process.exit(0)
}

makeTicket()
