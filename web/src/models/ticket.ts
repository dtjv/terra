import { format, addMinutes } from 'date-fns'
import { Schema, model } from 'mongoose'
import type { Model, Document, PopulatedDoc } from 'mongoose'

import oregon from '@/data/oregon.json'
import { VehicleModel } from '@/models/vehicle'
import type { Vehicle } from '@/models/vehicle'
import { TicketKind } from '@/constants/constants'

export interface TicketInput {
  ticketKind: TicketKind
  customerName: string
  destinationAddress: {
    street: string
    zip: string
  }
  vehicleKey: string
  scheduledAt: Date
  durationInMinutes: number
}

// add computed and virtual properties
export interface Ticket extends TicketInput {
  vehicle: PopulatedDoc<Vehicle & Document>
  ticketRange: string
  scheduledStartTime: string
}

export type UpdatedTicket = Partial<TicketInput>

export type TicketDocument = Ticket & Document

const ticketSchema = new Schema<Ticket, Model<Ticket>, Ticket>({
  ticketKind: {
    type: String,
    enum: Object.values(TicketKind),
    required: true,
  },
  customerName: {
    type: String,
    minLength: 2,
    maxLength: 40,
    required: true,
  },
  destinationAddress: {
    street: {
      type: String,
      minLength: 2,
      maxLength: 40,
      required: true,
    },
    zip: {
      type: String,
      enum: oregon.map(({ zip }) => zip),
      required: true,
    },
  },
  vehicleKey: {
    type: String,
    required: true,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  scheduledAt: {
    type: Schema.Types.Date,
    required: true,
  },
  durationInMinutes: {
    type: Number,
    min: 0,
    required: true,
  },
})

ticketSchema.virtual('ticketRange').get(function (this: Ticket) {
  const startTime = `${format(this.scheduledAt, 'h:mmaaa')}`
  const endTime = `${format(
    addMinutes(this.scheduledAt, this.durationInMinutes),
    'h:mmaaa'
  )}`
  return `${startTime} - ${endTime}`
})

ticketSchema.virtual('scheduledStartTime').get(function (this: Ticket) {
  return format(this.scheduledAt, 'h:mm a')
})

ticketSchema.pre<Ticket>('save', async function () {
  const vehicles = await VehicleModel.find({})
  const vehicle = vehicles.find(
    (vehicleDoc) => vehicleDoc.key === this.vehicleKey
  )

  if (!vehicle) {
    throw new Error(`Invalid vehicle key, '${this.vehicleKey}'`)
  }

  this.vehicle = vehicle._id
})

export const TicketModel = model<Ticket, Model<Ticket>>('Ticket', ticketSchema)
