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
import { TicketFormInputs } from '@/types/types'
import { TicketType } from '@/constants/constants'

export const TicketForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormInputs>({
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
  })

  const onSubmit: SubmitHandler<TicketFormInputs> = (data) => console.log(data)

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
        <Input id="deliveryAddress.zip" {...register('deliveryAddress.zip')} />
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

      <FormControl isInvalid={!!errors.durationInMinutes} isRequired>
        <FormLabel htmlFor="durationInMinutes">Duration</FormLabel>
        <Select
          id="durationInMinutes"
          placeholder="Select option"
          {...register('durationInMinutes')}
        >
          <option value={30}>30</option>
          <option value={60}>60</option>
          <option value={90}>90</option>
        </Select>
        <FormErrorMessage>
          {errors.durationInMinutes && errors.durationInMinutes.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.numExtraPersons} isRequired>
        <FormLabel htmlFor="numExtraPersons">Number of extra helpers</FormLabel>
        <Input id="numExtraPersons" {...register('numExtraPersons')} />
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
