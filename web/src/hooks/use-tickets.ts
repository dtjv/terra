import axios from 'axios'
import { useQueryClient, useQuery, useMutation } from 'react-query'
import {
  TICKETS_QUERY_KEY,
  TICKETS_API,
  //TICKETS_REFRESH_INTERVAL_IN_MS,
} from '@/config'
import type { Ticket, UpdatedTicket, TicketContext } from '@/types/types'

export interface useTicketsProps {
  scheduledAt: Date
}

export const useTickets = ({ scheduledAt }: useTicketsProps) => {
  const QUERY_KEYS = [TICKETS_QUERY_KEY, scheduledAt]
  const queryClient = useQueryClient()
  const ticketsQuery = useQuery<Ticket[], Error>(
    QUERY_KEYS,
    async () => {
      const scheduledAtEncoded = encodeURIComponent(scheduledAt.toISOString())
      // TODO: handle axios errors
      const { data } = await axios.get(
        `${TICKETS_API}?scheduledAt=${scheduledAtEncoded}`
      )
      return data
    },
    {
      //refetchInterval: TICKETS_REFRESH_INTERVAL_IN_MS,
      //refetchIntervalInBackground: true,
    }
  )

  const updateTicketMutation = useMutation<
    Ticket,
    Error,
    Ticket,
    TicketContext
  >(
    async (updatedTicket: UpdatedTicket) => {
      // TODO: handle axios errors
      const { data } = await axios.patch(`${TICKETS_API}/${updatedTicket.id}`, {
        updatedTicket,
      })

      return data
    },
    {
      onMutate: async (updatedTicket: UpdatedTicket) => {
        await queryClient.cancelQueries(QUERY_KEYS)

        const previousTickets =
          queryClient.getQueryData<Ticket[]>(QUERY_KEYS) ?? []

        // Optimistically updates the cache, allowing UI to render ticket
        // in new position. NOTE: the updated ticket is in an inconsistent
        // state (i.e., vehicleKey doesn't match vehicle, scheduledTimeRange
        // might not match scheduledTime.
        queryClient.setQueryData<Ticket[]>(
          QUERY_KEYS,
          (previousTickets = []) => {
            return previousTickets.map((prevTicket) => {
              return prevTicket.id === updatedTicket.id
                ? ({ ...prevTicket, ...updatedTicket } as Ticket)
                : prevTicket
            })
          }
        )

        return { previousTickets }
      },
      onError: (_, __, context) => {
        queryClient.setQueryData(QUERY_KEYS, context?.previousTickets ?? [])
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEYS)
      },
    }
  )

  return { ticketsQuery, updateTicketMutation }
}
