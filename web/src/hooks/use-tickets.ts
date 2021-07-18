import axios from 'axios'
import {
  //useQueryClient,
  useQuery,
  UseQueryResult,
  //useMutation,
  //UseMutationResult,
} from 'react-query'
import type { TicketLeanDoc } from '@/models/ticket'

const TICKETS_QUERY_KEY = 'tickets'
const TICKETS_API = process.env['NEXT_PUBLIC_TICKETS_API'] ?? ''
const TICKETS_REFRESH_INTERVAL = 1000 * 60 // 1 minute in ms

type UseTicketsReturnType = {
  ticketsQuery: UseQueryResult<TicketLeanDoc[]>
  /*
  updateTicketMutation: UseMutationResult<
    TicketData,
    Error,
    TicketData,
    TicketContext
  >
  */
}

export const useTickets = (): UseTicketsReturnType => {
  //const queryClient = useQueryClient()
  const ticketsQuery = useQuery<TicketLeanDoc[], Error>(
    [TICKETS_QUERY_KEY],
    async () => {
      if (TICKETS_API === '') {
        throw new Error('No ticket API defined')
      }
      const { data } = await axios.get(TICKETS_API)
      return data
    },
    {
      refetchInterval: TICKETS_REFRESH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )
  /*
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
  */

  return { ticketsQuery }
}
