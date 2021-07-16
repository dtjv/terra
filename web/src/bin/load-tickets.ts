import mongoose from 'mongoose'

import { Ticket, TicketLeanDoc } from '@/models/ticket'
import { Vehicle } from '@/models/vehicle'
import { newTickets } from '@/data/tickets'
import { connectToDB } from '@/lib/db'

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

  const vehicles = await Vehicle.find({})

  const tickets: TicketLeanDoc[] = newTickets.map((ticket) => {
    const vehicle = vehicles.find((doc) => doc.key === ticket.vehicleKey)

    if (!vehicle) {
      throw new Error(`Invalid vehicle key, '${ticket.vehicleKey}'`)
    }

    return { ...ticket, vehicle: vehicle._id }
  })

  await Ticket.create<TicketLeanDoc[]>(tickets)

  process.exit(0)
}

createTickets()
