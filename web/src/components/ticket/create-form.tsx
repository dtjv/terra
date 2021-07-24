import * as React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  Input,
  Button,
  Select,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { TicketFormSchema } from '@/schemas/schemas'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

export const CreateTicketForm: React.FC = () => {
  const form: UseFormReturn<TicketInput> = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: {
      ticketKind: TicketKind.DELIVERY,
      // TODO
      // - try the demo form w/o this set.
      vehicleKey: '102',
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

      <FormControl isInvalid={!!errors.destinationAddress?.street} isRequired>
        <FormLabel htmlFor="destinationAddress.street">
          Street address
        </FormLabel>
        <Input
          id="destinationAddress.street"
          {...register('destinationAddress.street')}
        />
        <FormErrorMessage>
          {errors?.destinationAddress?.street?.message ?? ''}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.destinationAddress?.zip} isRequired>
        <FormLabel htmlFor="destinationAddress.zip">ZIP / Postal</FormLabel>
        <Input
          id="destinationAddress.zip"
          {...register('destinationAddress.zip')}
        />
        <FormErrorMessage>
          {errors?.destinationAddress?.zip?.message ?? ''}
        </FormErrorMessage>
      </FormControl>

      {/*TODO: pull vehicle choices from env... i think.*/}
      <FormControl isInvalid={!!errors.vehicleKey} isRequired>
        <FormLabel htmlFor="vehicleKey">Vehicle</FormLabel>
        <Select id="vehicleKey" {...register('vehicleKey')}>
          <option value="102">Truck 102</option>
          <option value="202">Truck 202</option>
        </Select>
        <FormErrorMessage>{errors?.vehicleKey?.message ?? ''}</FormErrorMessage>
      </FormControl>

      {/*TODO: test enable/disable on demo*/}
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}
