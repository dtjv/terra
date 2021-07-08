import phone from 'phone'
import { parseOneAddress } from 'email-addresses'
import {
  define,
  enums,
  intersection,
  number,
  object,
  optional,
  string,
  coerce,
} from 'superstruct'
import oregon from '@/data/oregon.json'
import { TicketType } from '@/constants/constants'

export const IntSchema = coerce(number(), string(), (value) => parseInt(value))

export const EmailSchema = define(
  'EmailSchema',
  (value) => !!parseOneAddress(value as string)
)

export const PhoneSchema = define(
  'PhoneSchema',
  (value) => !!phone(value as string).length
)

export const AddressSchema = object({
  street: string(),
  zip: enums(oregon.map((location) => location.zip)),
})

export const TicketFormSchema = object({
  ticketType: enums([TicketType.PICKUP, TicketType.DELIVERY]),
  customerFirstName: string(),
  customerLastName: string(),
  customerEmail: intersection([string(), EmailSchema]),
  customerPhone: PhoneSchema,
  deliveryAddress: AddressSchema,
  //  orderId: optional(string()), // TODO: see NOTES
  //  products: array(ProductSchema),
  vehicleId: string(), // TODO: see NOTES
  scheduledDateTimeISO: string(), // TODO: see NOTES
  durationInMinutes: IntSchema, // TODO: see NOTES
  numExtraPersons: IntSchema,
  notes: optional(string()),
})
