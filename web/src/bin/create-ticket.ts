import { connectToDB, createTicket } from '@/lib/db'
import type { Ticket } from '@/models/ticket'
import { TicketKind } from '@/constants/constants'

export const makeTicket = async (): Promise<void> => {
  if (!(await connectToDB())) {
    console.error('failed to connect to db')
    process.exit(1)
  }

  const newTicket: Ticket = {
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

  const ticket = await createTicket(newTicket)

  console.log(ticket)

  process.exit(0)
}

makeTicket()
