import { format, addMinutes } from 'date-fns'
import { Schema, model, models } from 'mongoose'
import type { Model } from 'mongoose'
import oregon from '@/data/oregon.json'
import { VehicleModel } from '@/models/vehicle'
import { TicketKind } from '@/types/enums'
import type { Ticket } from '@/types/types'

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
  vehicleDoc: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  durationInMinutes: {
    type: Number,
    min: 0,
    required: true,
  },
})

ticketSchema.virtual('scheduledTimeRange').get(function (this: Ticket) {
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

  this.vehicleDoc = vehicle._id
})

export const TicketModel =
  models['Ticket'] ?? model<Ticket, Model<Ticket>>('Ticket', ticketSchema)
