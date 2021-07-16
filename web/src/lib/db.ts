import { connect, STATES } from 'mongoose'

import { Ticket } from '@/models/ticket'
import { Vehicle } from '@/models/vehicle'
import type { TicketProps, TicketDoc, TicketLeanDoc } from '@/models/ticket'

export const getTickets = async (): Promise<TicketLeanDoc[]> => {
  await connectToDB()

  const tickets = await Ticket.find({}).populate('vehicle')

  return tickets.map((ticket) =>
    ticket.toObject({ transform: transformObjectId })
  )
}

export const createTicket = async (
  newTicket: TicketProps
): Promise<TicketLeanDoc> => {
  await connectToDB()

  const vehicles = await Vehicle.find({})
  const vehicle = vehicles.find((doc) => doc.key === newTicket.vehicleKey)

  if (!vehicle) {
    throw new Error(`Invalid vehicle key, '${newTicket.vehicleKey}'`)
  }

  return await Ticket.create<TicketLeanDoc>({
    ...newTicket,
    vehicle: vehicle._id,
  })
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
