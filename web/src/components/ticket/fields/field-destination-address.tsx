import axios from 'axios'
import { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import {
  HStack,
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import oregon from '@/data/oregon.json'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

// TODO: use react-query so we're not always call api on re-renders.
const useDuration = () => {
  const axiosSource = axios.CancelToken.source()
  const getDurationAPI = async (street: string, zip: string) => {
    console.log(`calc duration: ${street} ${zip}...`)
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

export const FieldDestinationAddress = ({
  control,
  register,
  setValue,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const street = useWatch({ control, name: 'destinationAddress.street' })
  const zip = useWatch({ control, name: 'destinationAddress.zip' })
  const { getDurationAPI } = useDuration()

  useEffect(() => {
    const area = oregon.find((area) => area.zip === zip)
    if (area) {
      setValue('destinationAddress.city', area.city)
    }
  }, [zip, setValue])

  useEffect(() => {
    ;(async () => {
      if (
        zip &&
        street &&
        !errors.destinationAddress?.zip &&
        !errors.destinationAddress?.street
      ) {
        try {
          const duration = await getDurationAPI(street, zip)
          setValue('durationInMinutes', duration)
        } catch (error) {
          if (!getDurationAPI.isCanceled(error)) {
            throw error // TODO: correct?
          }
        }
      }
    })()
    return () => getDurationAPI.cancel()
  }, [
    street,
    zip,
    setValue,
    getDurationAPI,
    errors.destinationAddress?.street,
    errors.destinationAddress?.zip,
  ])

  return (
    <>
      <HStack spacing={4} w="100%">
        <FormControl isInvalid={!!errors.destinationAddress?.street} isRequired>
          <FormLabel htmlFor="destinationAddress.street" fontSize="sm">
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
        <FormControl w="25%">
          <FormLabel fontSize="sm">Unit No.</FormLabel>
          <Input
            id="destinationAddress.unit"
            {...register('destinationAddress.unit')}
          />
        </FormControl>
      </HStack>
      <HStack spacing={4} w="100%">
        <FormControl>
          <FormLabel fontSize="sm">City</FormLabel>
          <Input
            id="destinationAddress.city"
            {...register('destinationAddress.city')}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">State / Province</FormLabel>
          <Input
            id="destinationAddress.state"
            {...register('destinationAddress.state')}
            value="OR"
          />
        </FormControl>
        <FormControl isInvalid={!!errors.destinationAddress?.zip} isRequired>
          <FormLabel htmlFor="destinationAddress.zip" fontSize="sm">
            ZIP / Postal
          </FormLabel>
          <Input
            id="destinationAddress.zip"
            {...register('destinationAddress.zip')}
          />
          <FormErrorMessage>
            {errors?.destinationAddress?.zip?.message ?? ''}
          </FormErrorMessage>
        </FormControl>
      </HStack>
    </>
  )
}
