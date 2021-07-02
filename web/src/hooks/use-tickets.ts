import axios from 'axios'
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from 'react-query'

import type { TicketData } from '@/types/types'

export type UseTicketsReturnType = {
  ticketsQuery: UseQueryResult<TicketData[]>
  updateTicketMutation: UseMutationResult<
    TicketData,
    Error,
    TicketData,
    { previousTickets: TicketData[] | undefined }
  >
}

export const useTickets = (url = '/api/tickets'): UseTicketsReturnType => {
  const queryClient = useQueryClient()
  const ticketsQuery = useQuery<TicketData[], Error>(
    ['tickets'],
    async () => (await axios.get(url)).data,
    {
      refetchInterval: 1000 * 60,
      refetchIntervalInBackground: true,
    }
  )
  const updateTicketMutation = useMutation<
    TicketData,
    Error,
    TicketData,
    { previousTickets: TicketData[] | undefined }
  >(
    async (updatedTicket) => {
      return (await axios.patch(url, { updatedTicket })).data
    },
    {
      onMutate: async (updatedTicket: TicketData) => {
        await queryClient.cancelQueries('tickets')
        const previousTickets: TicketData[] | undefined =
          queryClient.getQueryData('tickets')

        queryClient.setQueryData(
          'tickets',
          (previousTickets: TicketData[] | undefined) => {
            return (previousTickets ?? []).map((prevTicket) => {
              return prevTicket.id === updatedTicket.id
                ? { ...prevTicket, ...updatedTicket }
                : prevTicket
            })
          }
        )
        return { previousTickets }
      },
      onError: (_, __, context) => {
        queryClient.setQueryData('tickets', context?.previousTickets ?? [])
      },
      onSettled: () => {
        queryClient.invalidateQueries('ticket')
      },
    }
  )

  return { ticketsQuery, updateTicketMutation }
}
