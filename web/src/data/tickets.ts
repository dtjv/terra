import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

export const newTickets: TicketInput[] = [
  {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'Mr. White',
    destinationAddress: {
      street: '123 Main St.',
      zip: '97301',
    },
    scheduledAt: new Date('2021-07-05T15:00:00.000Z'),
    vehicleKey: '102',
    durationInMinutes: 30,
  },
  {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'Mr. Black',
    destinationAddress: {
      street: '456 Elm St.',
      zip: '97302',
    },
    scheduledAt: new Date('2021-07-05T15:30:00.000Z'),
    vehicleKey: '102',
    durationInMinutes: 30,
  },
  {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'Mr. Peach',
    destinationAddress: {
      street: '555 Fruit St.',
      zip: '97301',
    },
    scheduledAt: new Date('2021-06-05T17:00:00.000Z'),
    vehicleKey: '102',
    durationInMinutes: 60,
  },
  {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'Mr. Apple',
    destinationAddress: {
      street: '321 Mac St.',
      zip: '97303',
    },
    scheduledAt: new Date('2021-06-05T15:00:00.000Z'),
    vehicleKey: '202',
    durationInMinutes: 90,
  },
  {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'Mr. Gruber',
    destinationAddress: {
      street: '999 Nakatomi St.',
      zip: '97301',
    },
    scheduledAt: new Date('2021-07-05T17:30:00.000Z'),
    vehicleKey: '202',
    durationInMinutes: 30,
  },
  {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'Mr. Smith',
    destinationAddress: {
      street: '765 Tree St.',
      zip: '97301',
    },
    scheduledAt: new Date('2021-07-05T18:00:00.000Z'),
    vehicleKey: '202',
    durationInMinutes: 30,
  },
  {
    ticketKind: TicketKind.DELIVERY,
    customerName: 'Mr. Jones',
    destinationAddress: {
      street: '987 Hazel St.',
      zip: '97305',
    },
    scheduledAt: new Date('2021-07-05T15:00:00.000Z'),
    vehicleKey: '302',
    durationInMinutes: 60,
  },
]
