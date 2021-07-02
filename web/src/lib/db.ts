import path from 'path'
import process from 'process'
import * as fs from 'fs/promises'

import type { TicketData, UpdatedTicketData } from '@/types/types'

const TICKETS_FILE = 'src/data/tickets.json'

export const readData = async <T>(file: string): Promise<T | undefined> => {
  try {
    const data = await fs.readFile(path.resolve(process.cwd(), file), 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error(`Failed to read data from '${file}'`)
  }

  return undefined
}

export const updateTicket = async (
  updatedTicket: UpdatedTicketData
): Promise<TicketData | undefined> => {
  const tickets = await readData<TicketData[]>(TICKETS_FILE)

  if (!tickets) {
    console.log('No tickets found')
    return undefined
  }

  let completeUpdatedTicket: TicketData | undefined = undefined

  const updatedTickets = tickets.map((ticket) => {
    if (ticket.id === updatedTicket.id) {
      completeUpdatedTicket = { ...ticket, ...updatedTicket }
      return completeUpdatedTicket
    }
    return ticket
  })

  try {
    await fs.writeFile(
      path.resolve(process.cwd(), TICKETS_FILE),
      JSON.stringify(updatedTickets),
      'utf8'
    )
  } catch (err) {
    console.error(`Failed to write updates to '${TICKETS_FILE}'`)
  }

  return completeUpdatedTicket
}
