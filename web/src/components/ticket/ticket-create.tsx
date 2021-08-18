import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Input,
  Button,
  Select,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import type { UseFormReturn } from 'react-hook-form'
import { ScheduleAtISO, DestinationAddress } from '@/components/ticket'
import { TicketFormSchema } from '@/schemas'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

export const CreateTicketForm = () => {
  const form: UseFormReturn<TicketInput> = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: {
      ticketKind: TicketKind.DELIVERY,
      scheduledAtISO: '',
      durationInMinutes: 30,
    },
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form

  //---------------------------------------------------------------------------
  // Event Handlers
  //---------------------------------------------------------------------------
  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    // TODO: POST /api/tickets
    console.log(`input fields: `, fields)
  }

  console.log(`errors: `, errors)
  console.log(`isValid: `, isValid)

  //---------------------------------------------------------------------------
  //
  // Render
  //
  //---------------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormControl isInvalid={!!errors.ticketKind} isRequired>
        <FormLabel htmlFor="ticketKind">Ticket type</FormLabel>
        <Select id="ticketKind" {...register('ticketKind')}>
          <option value={TicketKind.DELIVERY}>Delivery</option>
          <option value={TicketKind.PICKUP}>Pickup</option>
        </Select>
        <FormErrorMessage>{errors?.ticketKind?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.customerName} isRequired>
        <FormLabel htmlFor="customerFirstName">Name</FormLabel>
        <Input id="customerName" {...register('customerName')} />
        <FormErrorMessage>
          {errors?.customerName?.message ?? ''}
        </FormErrorMessage>
      </FormControl>

      <DestinationAddress {...form} />

      {/* TODO: pull vehicle choices from db!! exactly. then i don't have to
        validate in <ScheduleAtISO /> component.*/}
      <FormControl isInvalid={!!errors.vehicleKey} isRequired>
        <FormLabel htmlFor="vehicleKey">Vehicle</FormLabel>
        <Select
          id="vehicleKey"
          placeholder="Select a vehicle"
          {...register('vehicleKey')}
        >
          <option value="102">Truck 102</option>
          <option value="202">Truck 202</option>
        </Select>
        <FormErrorMessage>{errors?.vehicleKey?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <ScheduleAtISO {...form} />

      {/*TODO: test enable/disable on demo*/}
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}
