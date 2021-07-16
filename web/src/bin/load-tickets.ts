import mongoose from 'mongoose'

import { Ticket, TicketData } from '@/models/ticket'
import { Vehicle } from '@/models/vehicle'
import { newTickets } from '@/data/tickets'
import { connectToDB } from '@/lib/mongo-db'

export const createTickets = async (): Promise<void> => {
  if (!(await connectToDB())) {
    console.error(`failed to connect to db`)
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

  const vehicles = await Vehicle.find({})

  const tickets: TicketData[] = newTickets.map((ticket) => {
    const vehicle = vehicles.find((doc) => doc.key === ticket.vehicleKey)

    if (!vehicle) {
      throw new Error(
        `ticket references invalid vehicle key, '${ticket.vehicleKey}'`
      )
    }

    return { ...ticket, vehicle: vehicle._id }
  })

  await Ticket.create<TicketData[]>(tickets)

  process.exit(0)
}

createTickets()
