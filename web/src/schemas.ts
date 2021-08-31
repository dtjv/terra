import {
  coerce,
  enums,
  date,
  number,
  object,
  size,
  refine,
  string,
  define,
} from 'superstruct'
import phone from 'phone'
import { parseOneAddress } from 'email-addresses'
import oregon from '@/data/oregon.json'
import { TicketKind } from '@/types/enums'
import { SCHEDULE_TIME_BLOCK_IN_MINUTES } from '@/config'

const EmailSchema = define(
  'EmailSchema',
  (value) => !!parseOneAddress(value as string)
)

const PhoneSchema = define(
  'PhoneSchema',
  (value) => phone(value as string).isValid
)

export const DurationSchema = refine(
  number(),
  'DurationSchema',
  (value: number) => value % SCHEDULE_TIME_BLOCK_IN_MINUTES === 0
)

export const AddressSchema = object({
  street: string(),
  unit: string(),
  city: string(),
  state: size(string(), 2),
  zip: enums(oregon.map((location) => location.zip)),
})

export const ScheduledAtSchema = coerce(date(), string(), (value) => {
  const { scheduledAt } = JSON.parse(value)
  return new Date(scheduledAt)
})

export const TicketFormSchema = object({
  ticketKind: enums([TicketKind.PICKUP, TicketKind.DELIVERY]),
  firstName: string(),
  lastName: string(),
  email: EmailSchema,
  phone: PhoneSchema,
  destinationAddress: AddressSchema,
  vehicleKey: string(),
  scheduledAt: ScheduledAtSchema,
  scheduledTime: string(),
  durationInMinutes: DurationSchema,
})
