import axios from 'axios'
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from 'react-query'
import type {
  TicketData,
  TicketContext,
  UpdatedTicketData,
} from '@/types/types'

const ONE_MINUTE = 1000 * 60 // in milliseconds
const TICKETS_QUERY_KEY = 'tickets'
const TICKETS_API = process.env['NEXT_PUBLIC_TICKETS_API'] ?? ''

type UseTicketsReturnType = {
  ticketsQuery: UseQueryResult<TicketData[]>
  updateTicketMutation: UseMutationResult<
    TicketData,
    Error,
    TicketData,
    TicketContext
  >
}

export const useTickets = (): UseTicketsReturnType => {
  const queryClient = useQueryClient()
  const ticketsQuery = useQuery<TicketData[], Error>(
    [TICKETS_QUERY_KEY],
    async () => {
      if (TICKETS_API === '') {
        throw new Error('No ticket API defined')
      }
      const { data } = await axios.get(TICKETS_API)
      return data
    },
    {
      refetchInterval: ONE_MINUTE,
      refetchIntervalInBackground: true,
    }
  )
  const updateTicketMutation = useMutation<
    TicketData,
    Error,
    TicketData,
    TicketContext
  >(
    async (updatedTicket: UpdatedTicketData) => {
      if (TICKETS_API === '') {
        throw new Error('No Ticket API defined')
      }

      const { data } = await axios.patch(`${TICKETS_API}/${updatedTicket.id}`, {
        updatedTicket,
      })

      return data
    },
    {
      onMutate: async (updatedTicket: UpdatedTicketData) => {
        await queryClient.cancelQueries(TICKETS_QUERY_KEY)

        const previousTickets: TicketData[] =
          queryClient.getQueryData(TICKETS_QUERY_KEY) ?? []

        queryClient.setQueryData(
          TICKETS_QUERY_KEY,
          (previousTickets: TicketData[] | undefined = []) => {
            return previousTickets.map((prevTicket) => {
              return prevTicket.id === updatedTicket.id
                ? { ...prevTicket, ...updatedTicket }
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
