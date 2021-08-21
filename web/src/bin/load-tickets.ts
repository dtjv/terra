import mongoose from 'mongoose'
import { connectToDB } from '@/lib/db'
import { TicketModel } from '@/models/ticket'
import newTickets from '@/data/tickets.json'
import type { TicketInput } from '@/types/types'

export const createTickets = async (): Promise<void> => {
  if (!(await connectToDB())) {
    console.error(`Failed to connect to db.`)
    process.exit(1)
  }

  try {
    await mongoose.connection.db.dropCollection('tickets')
  } catch (error) {
    // ignore 'NamespaceNotFound' error
    if (error.code !== 26) {
      throw error
    }
  }

  const tickets = newTickets.map((newTicket) => {
    const { scheduledDate, ...ticket } = newTicket
    const d = new Date(scheduledDate)
    const [year, month, date] = [d.getFullYear(), d.getMonth(), d.getUTCDate()]

    return {
      ...ticket,
      scheduledAt: new Date(year, month, date),
    }
  })

  await TicketModel.create(tickets as TicketInput[])

  process.exit(0)
}

createTickets()
