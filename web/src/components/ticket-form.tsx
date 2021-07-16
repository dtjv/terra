import * as React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
} from '@chakra-ui/react'
//import { superstructResolver } from '@hookform/resolvers/superstruct'
//import { TicketFormSchema } from '@/schemas/schemas'
import type { TicketProps } from '@/models/ticket'
import { TicketKind } from '@/constants/constants'

//-----------------------------------------------------------------------------
//
// Ticket Form
//
//-----------------------------------------------------------------------------
export const TicketForm: React.FC = () => {
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TicketProps>({
    mode: 'onTouched',
    defaultValues: {
      durationInMinutes: 30,
    },
    //resolver: superstructResolver(TicketFormSchema, { coerce: true }),
  })

  const watchDeliveryAddress = watch([
    'destinationAddress.street',
    'destinationAddress.zip',
  ])

  React.useEffect(() => {
    if (isValid) {
      const { destinationAddress, durationInMinutes } = getValues()

      // TODO
      // - POST /api.googlemaps
      const maps = (destinationAddress: { zip: string; street: string }) => {
        switch (destinationAddress.zip) {
          case '97301':
            return 60
          case '97302':
            return 90
          default:
            return 120
        }
      }
      const estimatedDurationInMinutes = maps(destinationAddress)

      // prevent infinite render loop by not updating form cache unnecessarily.
      if (estimatedDurationInMinutes !== durationInMinutes) {
        setValue('durationInMinutes', estimatedDurationInMinutes, {
          shouldValidate: true,
        })
      }
    }
  }, [isValid, watchDeliveryAddress, getValues, setValue])

  // TODO
  // - render 'durationInMinutes'
  // - add filters (truck, am/pm)
  // - add 'search for times' or 'schedule' button
  // - add handler to call api to get open slots
  // - render list of 5 open slots, each with a button to select
  // - add link to get next 5 open slots - TBD
  // - add handler on select buttons to set 'scheduleAt' property
  // - render 'scheduledAt'
  // - once all required fields are set, enable 'create' button

  // TODO
  // - Q: is ticket form a modal or page?

  //---------------------------------------------------------------------------
  //
  // Event Handlers
  //
  //---------------------------------------------------------------------------
  const onSubmit: SubmitHandler<TicketProps> = (fields) => {
    const newTicket = {
      ...fields,
      scheduleAt: new Date(Date.now()),
      durationInMinutes: 60,
    }

    // TODO
    // - POST /api/tickets
    console.log(newTicket)
  }

  //---------------------------------------------------------------------------
  //
  // Render
  //
  //---------------------------------------------------------------------------
  // TODO
  // - make ticket type a radio button
  // - improve error text
  // - remove vehicle and schedule
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <FormControl isInvalid={!!errors.vehicleKey} isRequired>
        <FormLabel htmlFor="vehicleKey">Vehicle</FormLabel>
        <Select id="vehicleKey" {...register('vehicleKey')}>
          <option value="102">Truck 102</option>
          <option value="202">Truck 202</option>
        </Select>
        <FormErrorMessage>{errors?.vehicleKey?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}
