import { coerce, enums, number, object, size, string } from 'superstruct'
import oregon from '@/data/oregon.json'
import { TicketType } from '@/constants/constants'

export const IntSchema = coerce(number(), string(), (value) => parseInt(value))

export const AddressSchema = object({
  street: size(string(), 2, 40),
  zip: enums(oregon.map((location) => location.zip)),
})

export const TicketFormSchema = object({
  ticketType: enums([TicketType.PICKUP, TicketType.DELIVERY]),
  customerName: size(string(), 2, 40),
  deliveryAddress: AddressSchema,
  vehicleId: string(),
  scheduledDateTimeISO: string(),
  durationInMinutes: IntSchema,
})
