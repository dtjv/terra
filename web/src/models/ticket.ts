import { Schema, model, Model } from 'mongoose'

import oregon from '@/data/oregon.json'
import { TicketKind } from '@/constants/constants'

// ticket properties expected from ui.
export interface TicketProps {
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

// ticket properties we need to store.
export interface TicketData extends TicketProps {
  vehicle: Schema.Types.ObjectId
}

const ticketSchema = new Schema<TicketData, Model<TicketData>, TicketData>({
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
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
})

export const Ticket = model<TicketData, Model<TicketData>>(
  'Ticket',
  ticketSchema
)
