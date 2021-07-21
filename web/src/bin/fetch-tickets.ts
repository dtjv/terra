import { connectToDB, getTickets } from '@/lib/db'

export const fetchTickets = async (): Promise<void> => {
  if (!(await connectToDB())) {
    console.error('failed to connect to db')
    process.exit(1)
  }

  const ticketDocuments = await getTickets()
  console.log(ticketDocuments)

  process.exit(0)
}

fetchTickets()
