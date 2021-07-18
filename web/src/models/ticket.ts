import { format, addMinutes } from 'date-fns'
import { Schema, model } from 'mongoose'
import type { Model, Document, LeanDocument, PopulatedDoc } from 'mongoose'

import oregon from '@/data/oregon.json'
import { VehicleModel } from '@/models/vehicle'
import type { VehicleDoc } from '@/models/vehicle'
import { TicketKind } from '@/constants/constants'

// ticket properties expected from ui.
export interface Ticket {
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

// calculated & virtual ticket properties
export interface TicketDoc extends Ticket, Document {
  vehicle: PopulatedDoc<VehicleDoc & Document>
  ticketRange: string
  scheduledStartTime: string
}

export type TicketLeanDoc = LeanDocument<TicketDoc>

export type TicketUpdated = Pick<TicketLeanDoc, 'id'> & Partial<TicketLeanDoc>

const ticketSchema = new Schema<TicketDoc, Model<TicketDoc>, TicketDoc>({
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
  durationInMinutes: {
    type: Number,
    min: 0,
    required: true,
  },
  scheduledAt: {
    type: Schema.Types.Date,
    required: true,
  },
  vehicleKey: {
    type: String,
    required: true,
  },
  // computed on save
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
})

ticketSchema.virtual('ticketRange').get(function (this: TicketDoc) {
  const startTime = `${format(this.scheduledAt, 'h:mmaaa')}`
  const endTime = `${format(
    addMinutes(this.scheduledAt, this.durationInMinutes),
    'h:mmaaa'
  )}`
  return `${startTime} - ${endTime}`
})

ticketSchema.virtual('scheduledStartTime').get(function (this: TicketDoc) {
  return format(this.scheduledAt, 'h:mm a')
})

ticketSchema.pre<TicketDoc>('save', async function () {
  const vehicles = await VehicleModel.find({})
  const vehicle = vehicles.find(
    (vehicleDoc) => vehicleDoc.key === this.vehicleKey
  )

  if (!vehicle) {
    throw new Error(`Invalid vehicle key, '${this.vehicleKey}'`)
  }

  this.vehicle = vehicle._id
})

export const TicketModel = model<TicketDoc, Model<TicketDoc>>(
  'Ticket',
  ticketSchema
)
