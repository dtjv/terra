import { Box, Heading } from '@chakra-ui/react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { ScheduledAt } from '@/components/ticket/form'
import { TicketKind } from '@/types/enums'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

export const scheduleTab = { label: 'Schedule Appt.', icon: FaRegCalendarAlt }

export const StepSchedule = (form: UseFormReturn<TicketInput>) => {
  let service = form.getValues('ticketKind') as string

  service =
    service === TicketKind.DELIVERY || service === TicketKind.PICKUP
      ? service.toLowerCase()
      : 'service'

  return (
    <>
      <Heading fontSize="2xl" fontWeight="black" letterSpacing="tight">
        Schedule your {service}.
      </Heading>
      <Box mt={8}>
        <ScheduledAt {...form} />
      </Box>
    </>
  )
}
