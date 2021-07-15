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
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { TicketFormSchema } from '@/schemas/schemas'
import type { TicketFormInputs } from '@/types/types'
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
  } = useForm<TicketFormInputs>({
    mode: 'onTouched',
    defaultValues: {
      durationInMinutes: 30,
    },
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
  })

  const watchDeliveryAddress = watch([
    'deliveryAddress.street',
    'deliveryAddress.zip',
  ])

  React.useEffect(() => {
    if (isValid) {
      const { deliveryAddress, durationInMinutes } = getValues()

      // TODO
      // call api
      // react-query should handle caching results (so api isn't called)
      const maps = (deliveryAddress: { zip: string; street: string }) => {
        switch (deliveryAddress.zip) {
          case '97301':
            return 60
          case '97302':
            return 90
          default:
            return 120
        }
      }
      const estimatedDurationInMinutes = maps(deliveryAddress)

      // don't update form cache unnecessarily. prevents an infinite render loop
      if (estimatedDurationInMinutes !== durationInMinutes) {
        setValue('durationInMinutes', estimatedDurationInMinutes, {
          shouldValidate: true,
        })
      }
    }
  }, [isValid, watchDeliveryAddress, getValues, setValue])

  //---------------------------------------------------------------------------
  //
  // Event Handlers
  //
  //---------------------------------------------------------------------------
  const onSubmit: SubmitHandler<TicketFormInputs> = (data) => {
    // TODO: call api
    console.log('submitted', data)
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
      <FormControl isInvalid={!!errors.ticketType} isRequired>
        <FormLabel htmlFor="ticketType">Ticket type</FormLabel>
        <Select id="ticketType" {...register('ticketType')}>
          <option value={TicketKind.DELIVERY}>Delivery</option>
          <option value={TicketKind.PICKUP}>Pickup</option>
        </Select>
        <FormErrorMessage>{errors?.ticketType?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.customerName} isRequired>
        <FormLabel htmlFor="customerFirstName">Name</FormLabel>
        <Input id="customerName" {...register('customerName')} />
        <FormErrorMessage>
          {errors?.customerName?.message ?? ''}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.deliveryAddress?.street} isRequired>
        <FormLabel htmlFor="deliveryAddress.street">Street address</FormLabel>
        <Input
          id="deliveryAddress.street"
          {...register('deliveryAddress.street')}
        />
        <FormErrorMessage>
          {errors?.deliveryAddress?.street?.message ?? ''}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.deliveryAddress?.zip} isRequired>
        <FormLabel htmlFor="deliveryAddress.zip">ZIP / Postal</FormLabel>
        <Input id="deliveryAddress.zip" {...register('deliveryAddress.zip')} />
        <FormErrorMessage>
          {errors?.deliveryAddress?.zip?.message ?? ''}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.vehicleId} isRequired>
        <FormLabel htmlFor="vehicleId">Vehicle</FormLabel>
        <Select id="vehicleId" {...register('vehicleId')}>
          <option value="102">Truck 102</option>
          <option value="202">Truck 202</option>
        </Select>
        <FormErrorMessage>{errors?.vehicleId?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.scheduledDateTimeISO} isRequired>
        <FormLabel htmlFor="scheduledDateTimeISO">Schedule date</FormLabel>
        <Input
          id="scheduledDateTimeISO"
          {...register('scheduledDateTimeISO')}
        />
        <FormErrorMessage>
          {errors?.scheduledDateTimeISO?.message ?? ''}
        </FormErrorMessage>
      </FormControl>

      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}
