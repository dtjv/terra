import path from 'path'
import process from 'process'
import * as fs from 'fs/promises'

import type { AppData, TicketData } from '@/types/types'

export const getData = async (): Promise<AppData | undefined> => {
  try {
    const data = await fs.readFile(
      path.resolve(process.cwd(), 'src/data/data.json'),
      'utf8'
    )
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read data file')
  }

  return undefined
}

type UpdatedTicket = Pick<TicketData, 'id'> & Partial<TicketData>

export const updateTicket = async (
  updatedTicket: UpdatedTicket
): Promise<TicketData | undefined> => {
  const appData = await getData()

  if (!appData) {
    throw new Error('No data found')
  }

  let completeUpdatedTicket: TicketData | undefined = undefined

  const updatedAppData = {
    ...appData,
    tickets: appData.tickets.map((ticket) => {
      if (ticket.id === updatedTicket.id) {
        completeUpdatedTicket = { ...ticket, ...updatedTicket }
        return completeUpdatedTicket
      }
      return ticket
    }),
  }

  await fs.writeFile(
    path.resolve(__dirname, 'src/data/data.json'),
    JSON.stringify(updatedAppData),
    'utf8'
  )

  return completeUpdatedTicket
}
