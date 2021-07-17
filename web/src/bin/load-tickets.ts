import mongoose from 'mongoose'

import { connectToDB } from '@/lib/db'
import { TicketModel } from '@/models/ticket'
import type { Ticket } from '@/models/ticket'
import { newTickets } from '@/data/tickets'

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

  await TicketModel.create<Ticket>(newTickets)

  process.exit(0)
}

createTickets()
