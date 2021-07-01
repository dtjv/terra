import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import type { TicketData } from '@/types/types'

export const useTickets = (url = '/api/tickets') => {
  const queryClient = useQueryClient()
  const ticketsQuery = useQuery<TicketData[], Error>(
    ['tickets'],
    async () => (await axios.get(url)).data,
    {}
  )
  const updateTicketMutation = useMutation(
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
