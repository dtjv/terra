import { FaLeaf } from 'react-icons/fa'
import { Box, Heading } from '@chakra-ui/react'
import { TicketKind } from '@/types/enums'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

export const productTab = { label: 'Product List', icon: FaLeaf }

export const StepProduct = ({ getValues }: UseFormReturn<TicketInput>) => {
  const service = getValues('ticketKind')
  const heading =
    service === TicketKind.DELIVERY
      ? 'What products are we delivering?'
      : service === TicketKind.PICKUP
      ? 'What products are we picking up?'
      : 'Please list products'

  return (
    <>
      <Heading fontSize="2xl" fontWeight="black" letterSpacing="tight">
        {heading}
      </Heading>
      <Box mt={8}>TBD</Box>
    </>
  )
}
