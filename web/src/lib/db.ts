import { connect, STATES } from 'mongoose'

import { VehicleModel } from '@/models/vehicle'
import type { VehicleLeanDoc } from '@/models/vehicle'
import { TicketModel } from '@/models/ticket'
import type {
  Ticket,
  TicketUpdated,
  TicketDoc,
  TicketLeanDoc,
} from '@/models/ticket'

export const getVehicles = async (): Promise<VehicleLeanDoc[]> => {
  await connectToDB()
  const vehicles = await VehicleModel.find({})
  return vehicles.map((vehicle) =>
    vehicle.toObject({ transform: transformObjectId })
  )
}

export const getTickets = async (): Promise<TicketLeanDoc[]> => {
  await connectToDB()
  const tickets = await TicketModel.find({}).populate('vehicle')
  return tickets.map((ticket) =>
    ticket.toObject({ transform: transformObjectId })
  )
}

export const createTicket = async (
  newTicket: Ticket
): Promise<TicketLeanDoc> => {
  await connectToDB()
  const savedTicket = await TicketModel.create<Ticket>(newTicket)
  return savedTicket.toObject({ transform: transformObjectId })
}

export const updateTicket = async (
  ticketId: string,
  updatedTicket: TicketUpdated
): Promise<TicketLeanDoc> => {
  await connectToDB()

  const ticket = await TicketModel.findById(ticketId)

  if (!ticket) {
    throw new Error(`Ticket '${ticketId}' not found.`)
  }

  ticket.set(updatedTicket)
  return ticket.save()
}

let isConnected = false

export const connectToDB = async (): Promise<boolean> => {
  let db = null

  if (isConnected) return isConnected

  try {
    db = await connect(composeDbURI(), {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })

    const connection = db.connections[0]

    isConnected = !!connection && STATES[connection.readyState] === 'connected'
  } catch (error) {
    console.error(error)
  }

  return isConnected
}

const composeDbURI = () => {
  const dbPath = process.env['DB_PATH']
  const dbUser = process.env['DB_USER']
  const dbPass = process.env['DB_PASS']
  const dbName = process.env['DB_NAME']

  if (!dbPath) throw new Error(`Missing env var 'DB_PATH'`)
  if (!dbUser) throw new Error(`Missing env var 'DB_USER'`)
  if (!dbPass) throw new Error(`Missing env var 'DB_PASS'`)
  if (!dbName) throw new Error(`Missing env var 'DB_NAME'`)

  return dbPath
    .replace(/\$DB_USER/, dbUser)
    .replace(/\$DB_PASS/, dbPass)
    .replace(/\$DB_NAME/, dbName)
}

const transformObjectId = (_: TicketDoc, ret: TicketDoc): TicketLeanDoc => {
  if (ret._id) {
    ret.id = ret._id.toString()
    delete ret._id
  }
  return ret
}
