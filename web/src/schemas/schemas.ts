import phone from 'phone'
import isEmail from 'isemail'
import {
  define,
  defaulted,
  enums,
  intersection,
  number,
  object,
  optional,
  string,
} from 'superstruct'
import oregon from '@/data/oregon.json'
import { TicketType } from '@/constants/constants'

export const EmailSchema = define('EmailSchema', (value) =>
  isEmail.validate(value as string)
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
  orderId: optional(string()), // TODO: see NOTES
  // products: array(ProductSchema),
  vehicleId: string(), // TODO: see NOTES
  scheduledDateTimeISO: string(), // TODO: see NOTES
  durationInMinutes: number(), // TODO: see NOTES
  numExtraPersons: defaulted(number(), () => 0),
  notes: optional(string()),
})
