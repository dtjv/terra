import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Input,
  Button,
  Select,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import type { UseFormReturn } from 'react-hook-form'
import { ScheduleAt, DestinationAddress } from '@/components/ticket'
import { TicketFormSchema } from '@/schemas'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

export interface TicketCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TicketCreateModal = ({
  isOpen,
  onClose,
}: TicketCreateModalProps) => {
  const form: UseFormReturn<TicketInput> = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: { ticketKind: TicketKind.DELIVERY, scheduledTime: '' },
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form
  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    // TODO: POST /api/tickets
    console.log(`input fields: `, fields)
    onClose()
    reset()
  }

  return (
    <Modal
      preserveScrollBarGap
      size="xl"
      isCentered
      scrollBehavior="inside"
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl isInvalid={!!errors.ticketKind} isRequired>
              <FormLabel htmlFor="ticketKind">Ticket type</FormLabel>
              <Select id="ticketKind" {...register('ticketKind')}>
                <option value={TicketKind.DELIVERY}>Delivery</option>
                <option value={TicketKind.PICKUP}>Pickup</option>
              </Select>
              <FormErrorMessage>
                {errors?.ticketKind?.message ?? ''}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.customerName} isRequired>
              <FormLabel htmlFor="customerFirstName">Name</FormLabel>
              <Input id="customerName" {...register('customerName')} />
              <FormErrorMessage>
                {errors?.customerName?.message ?? ''}
              </FormErrorMessage>
            </FormControl>

            <DestinationAddress {...form} />

            <ScheduleAt {...form} />

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
              isDisabled={isSubmitting}
            >
              Submit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
