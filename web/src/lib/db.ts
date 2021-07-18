import { connect, STATES } from 'mongoose'

import { TicketModel } from '@/models/ticket'
import type {
  TicketInput,
  UpdatedTicket,
  TicketDocument,
} from '@/models/ticket'
import { VehicleModel } from '@/models/vehicle'
import type { VehicleDocument } from '@/models/vehicle'

export const getVehicles = async (): Promise<VehicleDocument[]> => {
  await connectToDB()
  return await VehicleModel.find({})
}

export const getTickets = async (): Promise<TicketDocument[]> => {
  await connectToDB()
  return await TicketModel.find({}).populate('vehicle')
}

export const createTicket = async (
  newTicket: TicketInput
): Promise<TicketDocument> => {
  await connectToDB()
  return await TicketModel.create<TicketInput>(newTicket)
}

export const updateTicket = async (
  ticketId: string,
  updatedTicket: UpdatedTicket
): Promise<TicketDocument> => {
  await connectToDB()

  const ticket = await TicketModel.findById(ticketId)

  if (!ticket) {
    throw new Error(`Ticket '${ticketId}' not found.`)
  }

  ticket.set(updatedTicket)
  return await ticket.save()
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RetType = Record<string, any>

export const transformObjectId = (_: unknown, ret: RetType): RetType => {
  if (ret['_id']) {
    ret['id'] = ret['_id'].toString()
    delete ret['_id']
  }
  return ret
}
