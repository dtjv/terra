import Chance from 'chance'
import minimist from 'minimist'
import mongoose from 'mongoose'
import { format, add, isAfter, isBefore } from 'date-fns'
import oregon from '@/data/oregon.json'
import { connectToDB } from '@/lib/db'
import { TicketKind } from '@/types/enums'
import { TicketModel } from '@/models/ticket'
import { combineDateTime, makeScheduleTimes } from '@/lib/utils'
import type { TicketInput } from '@/types/types'

type Appointments = Array<[string, string, number]>

const chance = new Chance()
const cities = [
  'Salem',
  'Lincoln City',
  'Eugene',
  'Corvallis',
  'Turner',
  'Portland',
  'Gervais',
  'Brooks',
  'Keiser',
  'Woodburn',
  'Albany',
  'Dallas',
  'Aumsville',
  'Jefferson',
  'Amity',
  'Silverton',
  'Scio',
  'Sublimity',
  'Lyons',
  'St. Paul',
]
const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const makeRandom = (a: Array<any> = []) => {
  return () => {
    const min = 0
    const max = a.length - 1
    const idx = getRandomIntInclusive(min, max)
    return a[idx]
  }
}
const getRandomCity = makeRandom(oregon.filter((o) => cities.includes(o.city)))
const makeRandomAddress = () => {
  const { city, zip } = getRandomCity()
  return {
    street: chance.street(),
    unit: '',
    city,
    zip,
    state: 'OR',
  }
}
const makeRandomPerson = () => {
  return {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    phone: chance.phone(),
  }
}
const makeRandomDuration = makeRandom([30, 30, 30, 60, 60, 60, 90, 120])
const makeRandomIsTicket = makeRandom([true, false])
const makeRandomMaxTicket = makeRandom([4, 5, 6, 7])

interface MakeAppointmentProps {
  vehicleKeys: string[]
  scheduleTimes: string[]
}

const makeAppointments = ({
  vehicleKeys,
  scheduleTimes,
}: MakeAppointmentProps): Appointments => {
  const appts: Appointments = []
  const eDate = combineDateTime(
    new Date(),
    scheduleTimes[scheduleTimes.length - 1] ?? '17:30:00.000'
  )

  for (const vehicleKey of vehicleKeys) {
    const maxTickets = makeRandomMaxTicket()

    let tDate
    let sDate = combineDateTime(new Date(), scheduleTimes[0] ?? '08:00:00.000')
    let numTickets = 0

    while (isBefore(sDate, eDate) && numTickets < maxTickets) {
      const isTicket = makeRandomIsTicket()
      const duration = makeRandomDuration()

      tDate = add(sDate, { minutes: duration })

      if (isTicket && !isAfter(tDate, eDate)) {
        appts.push([vehicleKey, format(sDate, 'HH:mm:ss.SSS'), duration])
        numTickets++
      }

      sDate = tDate
    }
  }

  return appts
}

const makeTickets = (scheduledDate: string, appts: Appointments) => {
  return appts.map(([vehicleKey, scheduledTime, durationInMinutes]) => {
    return {
      ticketKind: TicketKind.DELIVERY,
      ...makeRandomPerson(),
      destinationAddress: {
        ...makeRandomAddress(),
      },
      vehicleKey,
      scheduledTime,
      scheduledDate,
      durationInMinutes,
    }
  })
}

// Usage: load-tickets --date=2021-9-10 --drop
//
// Options
//   --date=<date>   yyyy-M-d. (default=today)
//   --drop          drop tickets collection  (default=false)
const main = async (): Promise<void> => {
  const args = minimist(process.argv.slice(2))
  const drop = Boolean(args?.['drop']) ?? false
  const scheduledDate = args?.['date'] ?? format(new Date(), 'yyyy-M-d')

  if (!(await connectToDB())) {
    console.error(`Failed to connect to db.`)
    process.exit(1)
  }

  if (drop) {
    try {
      await mongoose.connection.db.dropCollection('tickets')
    } catch (error: any) {
      if (error?.code !== 26) {
        throw error
      }
    }
  }

  const appointments = makeAppointments({
    vehicleKeys: ['102', '202', '302'],
    scheduleTimes: makeScheduleTimes({
      startHour: 8,
      endHour: 18,
      timeBlockInMinutes: 30,
    }),
  })

  const tickets = makeTickets(scheduledDate, appointments).map(
    ({ scheduledDate, ...ticket }) => ({
      ...ticket,
      scheduledAt: new Date(scheduledDate),
    })
  )

  await TicketModel.create(tickets as TicketInput[])

  process.exit(0)
}

main()
