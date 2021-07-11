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
import { TicketType } from '@/constants/constants'

// TODO: remove...
let renderCount = 0

// TODO: remove extras...
const defaultValues = {
  ticketType: TicketType.DELIVERY,
  customerFirstName: 'hans',
  customerLastName: 'gruber',
  customerEmail: 'hans@gruber.com',
  customerPhone: '(408) 280-9876',
  deliveryAddress: {
    street: '555 Market St.',
    //  zip: '97301',
  },
  vehicleId: '102',
  scheduledDateTimeISO: '1/1/2021',
  durationInMinutes: 30,
}

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
    defaultValues,
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
    mode: 'onTouched',
  })

  const watchDeliveryAddress = watch([
    'deliveryAddress.street',
    'deliveryAddress.zip',
  ])

  React.useEffect(() => {
    if (isValid) {
      const { deliveryAddress, durationInMinutes } = getValues()

      // TODO
      // replace w/ api
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

      // this block prevents an infinite render loop by not updating form cache
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
    // TODO
    // call api
    console.log('submitted', data)
  }

  //---------------------------------------------------------------------------
  //
  // Render
  //
  //---------------------------------------------------------------------------
  renderCount++
  console.log('renderCount', renderCount)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.ticketType} isRequired>
        <FormLabel htmlFor="ticketType">Ticket Type</FormLabel>
        <Select
          id="ticketType"
          placeholder="Select option"
          {...register('ticketType')}
        >
          <option value={TicketType.DELIVERY}>Delivery</option>
          <option value={TicketType.PICKUP}>Pickup</option>
        </Select>
        <FormErrorMessage>
          {errors.ticketType && errors.ticketType.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.customerFirstName} isRequired>
        <FormLabel htmlFor="customerFirstName">First Name</FormLabel>
        <Input
          id="customerFirstName"
          placeholder="Hans"
          {...register('customerFirstName', {
            required: `Customer's first name is required.`,
          })}
        />
        <FormErrorMessage>
          {errors.customerFirstName && errors.customerFirstName.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.customerLastName} isRequired>
        <FormLabel htmlFor="customerLastName">Last Name</FormLabel>
        <Input
          id="customerLastName"
          placeholder="Gruber"
          {...register('customerLastName', {
            required: `Customer's last name is required.`,
          })}
        />
        <FormErrorMessage>
          {errors.customerLastName && errors.customerLastName.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.customerEmail}>
        <FormLabel htmlFor="customerEmail">Email</FormLabel>
        <Input
          id="customerEmail"
          placeholder="hans_gruber@acme.com"
          {...register('customerEmail')}
        />
        <FormErrorMessage>
          {errors.customerEmail && errors.customerEmail.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.customerPhone} isRequired>
        <FormLabel htmlFor="customerPhone">Phone</FormLabel>
        <Input
          id="customerPhone"
          placeholder="(xxx) xxx-xxxx"
          {...register('customerPhone')}
        />
        <FormErrorMessage>
          {errors.customerPhone && errors.customerPhone.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.deliveryAddress?.street} isRequired>
        <FormLabel htmlFor="deliveryAddress.street">Street Address</FormLabel>
        <Input
          id="deliveryAddress.street"
          placeholder="555 Market St."
          {...register('deliveryAddress.street')}
        />
        <FormErrorMessage>
          {errors.deliveryAddress?.street &&
            errors.deliveryAddress.street.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.deliveryAddress?.zip} isRequired>
        <FormLabel htmlFor="deliveryAddress.zip">Zip Code</FormLabel>
        <Input
          id="deliveryAddress.zip"
          placeholder="97301"
          {...register('deliveryAddress.zip')}
        />
        <FormErrorMessage>
          {errors.deliveryAddress?.zip && errors.deliveryAddress.zip.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.vehicleId} isRequired>
        <FormLabel htmlFor="vehicleId">Vehicle</FormLabel>
        <Input id="vehicleId" {...register('vehicleId')} />
        <FormErrorMessage>
          {errors.vehicleId && errors.vehicleId.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.scheduledDateTimeISO} isRequired>
        <FormLabel htmlFor="scheduledDateTimeISO">Scheduled Date</FormLabel>
        <Input
          id="scheduledDateTimeISO"
          {...register('scheduledDateTimeISO')}
        />
        <FormErrorMessage>
          {errors.scheduledDateTimeISO && errors.scheduledDateTimeISO.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.numExtraPersons}>
        <Select
          id="numExtraPersons"
          placeholder="How many helpers?"
          {...register('numExtraPersons')}
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </Select>
        <FormErrorMessage>
          {errors.numExtraPersons && errors.numExtraPersons.message}
        </FormErrorMessage>
      </FormControl>

      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}
