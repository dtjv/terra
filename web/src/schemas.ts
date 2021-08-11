import { enums, number, object, size, refine, string } from 'superstruct'
import oregon from '@/data/oregon.json'
import { TicketKind } from '@/types/enums'
import { SCHEDULE_TIME_BLOCK_IN_MINUTES } from '@/constants/constants'

export const DurationSchema = refine(
  number(),
  'DurationSchema',
  (value: number) => value % SCHEDULE_TIME_BLOCK_IN_MINUTES === 0
)

export const AddressSchema = object({
  street: size(string(), 2, 50),

  // TODO: make zip field autocomplete
  zip: enums(oregon.map((location) => location.zip)),
})

export const TicketFormSchema = object({
  ticketKind: enums([TicketKind.PICKUP, TicketKind.DELIVERY]),
  customerName: size(string(), 2, 50),

  //TODO: add phone, email

  destinationAddress: AddressSchema,

  // a select input, values from db
  vehicleKey: string(),

  // a radio input, values computed
  scheduledAtISO: string(),

  // a computed value
  durationInMinutes: DurationSchema,
})
