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

  await TicketModel.create(newTickets as TicketInput[])

  process.exit(0)
}

createTickets()
