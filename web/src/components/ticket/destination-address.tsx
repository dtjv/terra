import * as React from 'react'
import { useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import oregon from '@/data/oregon.json'
import type { TicketInput } from '@/types/types'

// TODO: remove
const wait = (ms: number) => new Promise((success) => setTimeout(success, ms))

// TODO: remove
const rand = (min = 1, max = 4): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// TODO: remove
const api = async (): Promise<number> => {
  console.log(`calculating duration...`)
  await wait(2000)
  return 30 * rand()
}

const isZipValid = (zip: string) => !!oregon.find((data) => data.zip === zip)

export const DestinationAddress: React.FC<UseFormReturn<TicketInput>> = ({
  control,
  register,
  setValue,
  formState: { errors },
}) => {
  const street = useWatch({ control, name: 'destinationAddress.street' })
  const zip = useWatch({ control, name: 'destinationAddress.zip' })

  React.useEffect(() => {
    ;(async () => {
      if (
        !errors.destinationAddress?.street &&
        !errors.destinationAddress?.zip &&
        isZipValid(zip)
      ) {
        const duration = await api()
        console.log(`-> duration:`, duration)
        setValue('durationInMinutes', duration)
      }
    })()
  }, [
    street,
    zip,
    setValue,
    errors.destinationAddress?.street,
    errors.destinationAddress?.zip,
  ])

  return (
    <>
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
    </>
  )
}
