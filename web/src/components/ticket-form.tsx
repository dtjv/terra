import * as React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { TicketFormSchema } from '@/schemas/schemas'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

export const TicketForm: React.FC = () => {
  const {
    watch,
    setValue,
    getValues,
    register,
    setError,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TicketInput>({
    mode: 'onChange',
    defaultValues: {
      ticketKind: TicketKind.DELIVERY,
      destinationAddress: {
        street: '555 main st',
        zip: '97301',
      },
      vehicleKey: '102',
      durationInMinutes: 30,
    },
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
  })
  const [scheduledAtChoices, setScheduledAtChoices] = React.useState<
    Array<{
      id: number
      dateISO: string
    }>
  >([])
  const [selectedScheduledAt, setSelectedScheduledAt] = React.useState<
    Date | undefined
  >(undefined)

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
            return 30
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
        setScheduledAtChoices([])
        setSelectedScheduledAt(undefined)
        setError('scheduledAt', { type: 'stale', message: 'stale' })
      }
    }
  }, [isValid, watchDeliveryAddress, getValues, setValue])

  const { vehicleKey, durationInMinutes } = getValues()
  const isSearchButtonEnabled = !!vehicleKey && !!durationInMinutes

  const vehicleKeyField = register('vehicleKey', { required: true })

  //---------------------------------------------------------------------------
  //
  // Event Handlers
  //
  //---------------------------------------------------------------------------
  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    const scheduleAtISO = getValues().scheduledAt.toISOString()

    if (
      !scheduledAtChoices.find((choice) => choice.dateISO === scheduleAtISO)
    ) {
      setError('scheduledAt', { type: 'stale', message: 'stale' })
      return
    }

    // TODO: POST /api/tickets
    console.log(`newTicket:`, fields)
  }

  const handleSearchClick = async () => {
    // TODO
    // 1. call api to get available time slots
    const { vehicleKey } = getValues()
    const allChoices = [
      { id: 1, dateISO: '2021-09-05T10:00:00.000Z' },
      { id: 2, dateISO: '2021-09-05T11:00:00.000Z' },
      { id: 3, dateISO: '2021-09-05T12:00:00.000Z' },
      { id: 4, dateISO: '2021-09-05T13:30:00.000Z' },
      { id: 5, dateISO: '2021-09-05T14:30:00.000Z' },
      { id: 6, dateISO: '2021-09-05T15:30:00.000Z' },
    ]
    const narrowedChoices =
      vehicleKey === '102' ? allChoices.slice(0, 3) : allChoices.slice(2)

    // 2. set choices with api results
    setScheduledAtChoices(narrowedChoices)
  }

  const handleScheduledAtChoicesChange = (scheduledAtChoice: string) => {
    const scheduledAt = new Date(scheduledAtChoice)
    setSelectedScheduledAt(scheduledAt)
    setValue('scheduledAt', scheduledAt, { shouldValidate: true })
  }

  const handleVehicleKeyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    vehicleKeyField.onChange(event)
    setValue('vehicleKey', event.target.value)
    setScheduledAtChoices([])
    setSelectedScheduledAt(undefined)
    setError('scheduledAt', {
      type: 'stale',
      message: 'Please select a time slot',
    })
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

      <FormControl isInvalid={!!errors.vehicleKey} isRequired>
        <FormLabel htmlFor="vehicleKey">Vehicle</FormLabel>
        <Select
          id="vehicleKey"
          onChange={handleVehicleKeyChange}
          ref={vehicleKeyField.ref}
        >
          <option value="102">Truck 102</option>
          <option value="202">Truck 202</option>
        </Select>
        <FormErrorMessage>{errors?.vehicleKey?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <Button
        mt={4}
        colorScheme={isSearchButtonEnabled ? 'blue' : 'gray'}
        isDisabled={!isSearchButtonEnabled}
        onClick={handleSearchClick}
      >
        Search
      </Button>

      {scheduledAtChoices.length > 0 ? (
        <FormControl as="fieldset" isInvalid={!!errors.scheduledAt} isRequired>
          <FormLabel as="legend">Choose an available time slot</FormLabel>
          <RadioGroup
            id="scheduledAt"
            onChange={handleScheduledAtChoicesChange}
            value={selectedScheduledAt?.toISOString()}
          >
            <Stack>
              {scheduledAtChoices.map(({ id, dateISO }) => {
                return (
                  <Radio key={id} value={dateISO}>
                    {new Date(dateISO).toLocaleString()}
                  </Radio>
                )
              })}
            </Stack>
          </RadioGroup>
          <FormErrorMessage>
            {errors?.scheduledAt?.message ?? ''}
          </FormErrorMessage>
        </FormControl>
      ) : null}

      <Button
        mt={4}
        colorScheme={isValid ? 'teal' : 'gray'}
        isDisabled={!isValid}
        isLoading={isSubmitting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  )
}
