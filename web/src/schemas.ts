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

export const ScheduledAtSchema = coerce(date(), string(), (value) => {
  const { scheduledAt } = JSON.parse(value)
  return new Date(scheduledAt)
})

export const TicketFormSchema = object({
  ticketKind: enums([TicketKind.PICKUP, TicketKind.DELIVERY]),
  customerName: size(string(), 2, 50),
  destinationAddress: AddressSchema,
  vehicleKey: string(),
  scheduledAt: ScheduledAtSchema,
  scheduledTime: string(),
  durationInMinutes: DurationSchema,
})
