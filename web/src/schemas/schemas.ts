import phone from 'phone'
import { parseOneAddress } from 'email-addresses'
import {
  coerce,
  define,
  enums,
  intersection,
  number,
  object,
  optional,
  size,
  string,
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
  street: size(string(), 2, 40),
  zip: enums(oregon.map((location) => location.zip)),
})

export const TicketFormSchema = object({
  ticketType: enums([TicketType.PICKUP, TicketType.DELIVERY]),
  customerFirstName: size(string(), 2, 40),
  customerLastName: size(string(), 2, 40),
  customerEmail: intersection([string(), EmailSchema]),
  customerPhone: PhoneSchema,
  deliveryAddress: AddressSchema,
  //  orderId: optional(string()),
  //  products: array(ProductSchema),
  vehicleId: string(),
  scheduledDateTimeISO: string(),
  durationInMinutes: IntSchema,
  numExtraPersons: IntSchema,
  notes: optional(string()),
})
