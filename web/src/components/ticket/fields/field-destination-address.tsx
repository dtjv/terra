import axios from 'axios'
import { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import oregon from '@/data/oregon.json'
import type { TicketInput } from '@/types/types'

const isZipValid = (zip: string) => !!oregon.find((data) => data.zip === zip)

const useDuration = () => {
  const axiosSource = axios.CancelToken.source()
  const getDurationAPI = async (street: string, zip: string) => {
    console.log(`calculating duration for: {street: ${street}, zip: ${zip}}...`)
    return (
      await axios.post(
        '/api/demo/duration',
        { zip },
        { cancelToken: axiosSource.token }
      )
    ).data
  }
  getDurationAPI.cancel = () => axiosSource.cancel()
  getDurationAPI.isCanceled = (error: any) => axios.isCancel(error)
  return { getDurationAPI }
}

export const DestinationAddress = ({
  control,
  register,
  setValue,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const street = useWatch({ control, name: 'destinationAddress.street' })
  const zip = useWatch({ control, name: 'destinationAddress.zip' })
  const { getDurationAPI } = useDuration()

  useEffect(() => {
    ;(async () => {
      if (
        !errors.destinationAddress?.street &&
        !errors.destinationAddress?.zip &&
        isZipValid(zip)
      ) {
        try {
          const duration = await getDurationAPI(street, zip)
          console.log(`-> duration:`, duration)
          setValue('durationInMinutes', duration)
        } catch (error) {
          if (getDurationAPI.isCanceled(error)) {
            console.log(`getDurationAPI is cancelled`)
          } else throw error
        }
      }
    })()
    return () => getDurationAPI.cancel()
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
