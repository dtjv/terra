import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import {
  SCHEDULE_START_HOUR_IN_24HR,
  SCHEDULE_END_HOUR_IN_24HR,
  SCHEDULE_TIME_BLOCK_IN_MINUTES,
} from '@/config/constants'
import { getTickets } from '@/lib/db'
import { combineDateTime, makeScheduleTimes } from '@/lib/utils'
import type { TicketInput } from '@/types/types'
import { data } from './data'

interface Hash {
  [key: string]: number
}

interface ReqBody {
  vehicleKeys: string[]
  currentDate: Date
  currentTime: string
  requestDate: Date
  durationInMinutes: number
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const {
      vehicleKeys,
      currentDate,
      currentTime,
      requestDate,
      durationInMinutes,
    }: ReqBody = req.body

    const scheduleTimes = makeScheduleTimes({
      startHour: SCHEDULE_START_HOUR_IN_24HR,
      endHour: SCHEDULE_END_HOUR_IN_24HR,
      timeBlockInMinutes: SCHEDULE_TIME_BLOCK_IN_MINUTES,
    })
    const scheduleTimeBlockCount = scheduleTimes.length

    // Create an array of [1|0] to represent a time block as available or not.
    // If 'requestDate' is not supplied, then we're trying to find open slots
    // for 'currentDate' - which means we mark time blocks before 'currentTime'
    // as not available.
    let bitstr = ''

    if (!requestDate) {
      for (const scheduleTime of scheduleTimes) {
        if (scheduleTime < currentTime) {
          bitstr += '0'
        }
      }
      bitstr = bitstr.padEnd(scheduleTimeBlockCount, '1')
    } else {
      bitstr = Array(scheduleTimeBlockCount).fill('1').join('')
    }

    const scheduleTimesMask = parseInt(bitstr, 2)

    // Create a hash to associate each 'vehicleKey' to a 'scheduleTimesMask'.
    let vehicleHash: Hash = vehicleKeys.reduce(
      (hash, v) => ({ ...hash, [v]: scheduleTimesMask }),
      {} as Hash
    )

    // Note: 'scheduleTime' & 'currentTime' are 24hr, local strings - not UTC.
    const tickets: TicketInput[] = await getTickets({
      vehicleKey: { $in: vehicleKeys },
      ...(requestDate
        ? { scheduledAt: requestDate }
        : {
            scheduledAt: currentDate,
            scheduledTime: { $gt: currentTime },
          }),
    })

    // Mark each ticket's time blocks as 'not available'.
    for (const ticket of tickets) {
      const ticketTimeBlockCount = ticket.durationInMinutes / 30
      const ticketScheduledTimeIndex = scheduleTimes.indexOf(
        ticket.scheduledTime
      )

      if (ticketScheduledTimeIndex !== -1) {
        let mask = parseInt(
          (2 ** ticketTimeBlockCount - 1)
            .toString(2)
            .padEnd(scheduleTimeBlockCount, '0'),
          2
        )
        mask >>= ticketScheduledTimeIndex
        vehicleHash[ticket.vehicleKey] ^= mask
      } else {
        console.error(`No time list entry for '${ticket.scheduledTime}'`)
      }
    }

    // After processing above, 'scheduleTimesMask' might be left with leading
    // zeros (i.e. '00011101001') - except leading zero's don't exist in a
    // numeric mask. To preserve the leading zero's and enable further bitwise
    // operation, I prepend a 1.
    vehicleHash = Object.entries(vehicleHash).reduce((hash, [k, v]) => {
      return {
        ...hash,
        [k]: parseInt(
          `1${v.toString(2).padStart(scheduleTimeBlockCount, '0')}`,
          2
        ),
      }
    }, {})

    // Find available time blocks for ticket we're trying to create.
    const ticketTimeBlockCount = durationInMinutes / 30
    const shiftCount = scheduleTimeBlockCount - ticketTimeBlockCount
    const availableTimes = Object.entries(vehicleHash)
      .map(([vehicleKey, scheduleTimesMask]) => {
        const times: string[] = []

        // +1 to accommodate first bit
        let mask = parseInt(
          (2 ** ticketTimeBlockCount - 1)
            .toString(2)
            .padEnd(scheduleTimeBlockCount + 1, '0'),
          2
        )
        // adjust to ignore the first bit
        mask >>= 1

        for (let i = 0; i <= shiftCount; i += 1) {
          if ((mask & scheduleTimesMask) === mask) {
            times.push(scheduleTimes[i] ?? 'ERROR')
          }
          mask >>= 1
        }

        return {
          vehicleKey,
          availableTimes: times,
        }
      })
      .flatMap(({ vehicleKey, availableTimes }, i) => {
        return availableTimes.map((time, j) => {
          const scheduledAt = new Date(requestDate ?? currentDate)
          return {
            key: `${i}-${j}`,
            vehicleKey,
            scheduledAt,
            scheduledTime: time,
            scheduledAtFull: combineDateTime(scheduledAt, time),
          }
        })
      })

    // TODO: remove fake data
    return res.status(200).json(/*availableTimes*/ data)
  }

  return res.status(404).send(`Unsupported request method: ${req.method}`)
}

export default handler
