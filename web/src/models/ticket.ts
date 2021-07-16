import { Schema, model } from 'mongoose'
import type { Model, Document, LeanDocument } from 'mongoose'

import oregon from '@/data/oregon.json'
import { Vehicle } from '@/models/vehicle'
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
export interface TicketDoc extends TicketProps, Document {
  vehicle: Schema.Types.ObjectId | typeof Vehicle
}

export type TicketLeanDoc = LeanDocument<TicketDoc>

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
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
})

export const Ticket = model<TicketDoc, Model<TicketDoc>>('Ticket', ticketSchema)
