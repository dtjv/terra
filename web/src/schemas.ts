import {
  coerce,
  enums,
  date,
  number,
  object,
  size,
  refine,
  string,
} from 'superstruct'
import oregon from '@/data/oregon.json'
import { TicketKind } from '@/types/enums'
import { SCHEDULE_TIME_BLOCK_IN_MINUTES } from '@/config'

export const DurationSchema = refine(
  number(),
  'DurationSchema',
  (value: number) => value % SCHEDULE_TIME_BLOCK_IN_MINUTES === 0
)

export const AddressSchema = object({
  street: size(string(), 2, 50),
  zip: enums(oregon.map((location) => location.zip)),
})

// TODO: the string coming in.. what's its format? it must be: 'YYYY-MM-DD'
// this i can parse it out like load-tickets.ts and create the valid UTC date.
export const DateSchema = coerce(date(), string(), (value) => new Date(value))

export const TicketFormSchema = object({
  ticketKind: enums([TicketKind.PICKUP, TicketKind.DELIVERY]),
  customerName: size(string(), 2, 50),
  destinationAddress: AddressSchema,
  vehicleKey: string(),
  scheduledAt: DateSchema,
  scheduledTime: string(),
  durationInMinutes: DurationSchema,
})
