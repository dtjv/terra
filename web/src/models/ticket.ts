import { format, addMinutes } from 'date-fns'
import { Schema, model, models } from 'mongoose'
import type { Model } from 'mongoose'
import oregon from '@/data/oregon.json'
import { VehicleModel } from '@/models/vehicle'
import { TicketKind } from '@/types/enums'
import { combineDateTime } from '@/lib/utils'
import type { Ticket } from '@/types/types'

const ticketSchema = new Schema<Ticket, Model<Ticket>, Ticket>({
  ticketKind: {
    type: String,
    enum: Object.values(TicketKind),
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  destinationAddress: {
    street: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      min: 2,
      max: 2,
      default: 'OR',
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
  const scheduledAtFull = combineDateTime(this.scheduledAt, this.scheduledTime)
  const startTime = `${format(scheduledAtFull, 'h:mmaaa')}`
  const endTime = `${format(
    addMinutes(scheduledAtFull, this.durationInMinutes),
    'h:mmaaa'
  )}`
  return `${startTime} - ${endTime}`
})

/**
 * Sets 'vehicle' property based on 'vehicleKey'
 */
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
