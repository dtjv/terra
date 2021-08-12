import axios from 'axios'
import { useQueryClient, useQuery, useMutation } from 'react-query'
import {
  TICKETS_QUERY_KEY,
  TICKETS_API,
  TICKETS_REFRESH_INTERVAL_IN_MS,
} from '@/config'
import type { Ticket, UpdatedTicket, TicketContext } from '@/types/types'

export const useTickets = () => {
  const queryClient = useQueryClient()

  const ticketsQuery = useQuery<Ticket[], Error>(
    [TICKETS_QUERY_KEY],
    async () => {
      // TODO: handle axios errors
      const { data } = await axios.get(TICKETS_API)
      return data
    },
    {
      refetchInterval: TICKETS_REFRESH_INTERVAL_IN_MS,
      refetchIntervalInBackground: true,
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
        await queryClient.cancelQueries(TICKETS_QUERY_KEY)

        const previousTickets =
          queryClient.getQueryData<Ticket[]>(TICKETS_QUERY_KEY) ?? []

        queryClient.setQueryData<Ticket[]>(
          TICKETS_QUERY_KEY,
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
        queryClient.setQueryData(
          TICKETS_QUERY_KEY,
          context?.previousTickets ?? []
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries(TICKETS_QUERY_KEY)
      },
    }
  )

  return { ticketsQuery, updateTicketMutation }
}
