import axios from 'axios'
import {
  useQueryClient,
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from 'react-query'
import type { Ticket, UpdatedTicket, TicketContext } from '@/types/types'

const TICKETS_QUERY_KEY = 'tickets'
const TICKETS_API = process.env['NEXT_PUBLIC_TICKETS_API'] ?? ''
const TICKETS_REFRESH_INTERVAL = 1000 * 60 // 1 minute in ms

type UseTicketsReturnType = {
  ticketsQuery: UseQueryResult<Ticket[]>
  updateTicketMutation: UseMutationResult<Ticket, Error, Ticket, TicketContext>
}

export const useTickets = (): UseTicketsReturnType => {
  const queryClient = useQueryClient()

  const ticketsQuery = useQuery<Ticket[], Error>(
    [TICKETS_QUERY_KEY],
    async () => {
      // TODO: handle axios errors
      const { data } = await axios.get(TICKETS_API)
      return data
    },
    {
      refetchInterval: TICKETS_REFRESH_INTERVAL,
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
