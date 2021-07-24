import { coerce, enums, number, object, size, string } from 'superstruct'
import oregon from '@/data/oregon.json'
import { TicketKind } from '@/types/enums'

export const IntSchema = coerce(number(), string(), (value) => parseInt(value))

export const AddressSchema = object({
  // TODO:
  // - is size necessary?
  street: size(string(), 2),
  zip: enums(oregon.map((location) => location.zip)),
})

export const TicketFormSchema = object({
  ticketKind: enums([TicketKind.PICKUP, TicketKind.DELIVERY]),
  customerName: size(string(), 2),

  //TODO
  // - add phone
  // - add email

  destinationAddress: AddressSchema,

  // TODO:
  // - should be enum from values set as env vars.
  vehicleKey: string(),
  scheduledAtISO: string(),

  // TODO:
  // - should be a multiple of NEXT_PUBLIC_SCHEDULE_TIME_BLOCK_IN_MINUTES
  durationInMinutes: IntSchema,
})
