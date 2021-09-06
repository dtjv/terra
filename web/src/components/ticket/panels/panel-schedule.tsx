import { Box, Heading } from '@chakra-ui/react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FieldScheduledAt } from '@/components/ticket/fields'
import { TicketKind } from '@/types/enums'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

export const TabSchedule = { label: 'Schedule Appt.', icon: FaRegCalendarAlt }

export const PanelSchedule = (form: UseFormReturn<TicketInput>) => {
  let service = form.getValues('ticketKind') as string

  service =
    service === TicketKind.DELIVERY || service === TicketKind.PICKUP
      ? service.toLowerCase()
      : 'service'

  return (
    <Box pt={10}>
      <Heading fontSize="2xl" fontWeight="black" letterSpacing="tight">
        Please select a day and time for {service}.
      </Heading>
      <Box mt={8}>
        <FieldScheduledAt {...form} />
      </Box>
    </Box>
  )
}
