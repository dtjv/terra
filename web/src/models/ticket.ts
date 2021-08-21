import { set, format, addMinutes } from 'date-fns'
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
  scheduledTime: {
    type: String,
    require: true,
  },
  durationInMinutes: {
    type: Number,
    min: 0,
    required: true,
  },
})

/**
 * @returns {string} time range in 12-hour clock format (eg: '8:00am - 8:30am')
 */
ticketSchema.virtual('scheduledTimeRange').get(function (this: Ticket) {
  const [hour, minute] = this.scheduledTime.split(':')
  const scheduledAtFull = set(this.scheduledAt, {
    hours: parseInt(hour ?? '0', 10),
    minutes: parseInt(minute ?? '0', 10),
    seconds: 0,
    milliseconds: 0,
  })
  const startTime = `${format(scheduledAtFull, 'h:mmaaa')}`
  const endTime = `${format(
    addMinutes(scheduledAtFull, this.durationInMinutes),
    'h:mmaaa'
  )}`

  return `${startTime} - ${endTime}`
})

/**
 * @returns {string} start time in 12-hour clock format (eg: '6:30 PM')
 */
ticketSchema.virtual('scheduledStartTime').get(function (this: Ticket) {
  return format(this.scheduledAt, 'h:mm a')
})

ticketSchema.pre<Ticket>('save', async function () {
  const vehicles = await VehicleModel.find({})
  const vehicle = vehicles.find(
    (vehicleDoc) => vehicleDoc.vehicleKey === this.vehicleKey
  )

  if (!vehicle) {
    throw new Error(`Invalid vehicle key, '${this.vehicleKey}'`)
  }

  this.vehicleDoc = vehicle._id
})

export const TicketModel =
  models['Ticket'] ?? model<Ticket, Model<Ticket>>('Ticket', ticketSchema)
