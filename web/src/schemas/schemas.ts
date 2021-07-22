import { coerce, enums, number, object, size, string, date } from 'superstruct'
import oregon from '@/data/oregon.json'
import { TicketKind } from '@/types/enums'

export const IntSchema = coerce(number(), string(), (value) => parseInt(value))

export const AddressSchema = object({
  street: size(string(), 2, 40),
  zip: enums(oregon.map((location) => location.zip)),
})

export const TicketFormSchema = object({
  ticketType: enums([TicketKind.PICKUP, TicketKind.DELIVERY]),
  customerName: size(string(), 2, 40),
  deliveryAddress: AddressSchema,
  vehicleKey: string(),
  scheduledAt: date(),
  durationInMinutes: IntSchema,
})
