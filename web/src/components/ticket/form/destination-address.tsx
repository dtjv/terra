import axios from 'axios'
import { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Tooltip,
  HStack,
  Input,
  Select,
  FormLabel,
  FormControl,
} from '@chakra-ui/react'
import oregon from '@/data/oregon.json'
import states from '@/data/states.json'
import { styles } from '@/components/ticket/form'
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
        <FormControl isInvalid={!!errors.destinationAddress?.street} px="2px">
          <FormLabel htmlFor="destinationAddress.street" fontSize="sm">
            Street address
          </FormLabel>
          <Tooltip
            isDisabled={!errors.destinationAddress?.street}
            label={errors.destinationAddress?.street?.message}
            bg="red.500"
          >
            <Input
              id="destinationAddress.street"
              sx={{
                ...(errors.destinationAddress?.street
                  ? styles.error
                  : styles.base),
              }}
              _focus={{
                ...(errors.destinationAddress?.street
                  ? styles.focus.error
                  : styles.focus.base),
              }}
              {...register('destinationAddress.street', {
                required: {
                  value: true,
                  message: 'Required',
                },
                maxLength: {
                  value: 80,
                  message: 'Maximum length is 80',
                },
              })}
            />
          </Tooltip>
        </FormControl>
        <FormControl w="25%" px="2px">
          <FormLabel fontSize="sm">Unit No.</FormLabel>
          <Input
            id="destinationAddress.unit"
            _focus={{
              ...styles.focus.base,
            }}
            {...register('destinationAddress.unit')}
          />
        </FormControl>
      </HStack>
      <HStack spacing={4} w="full">
        <FormControl isInvalid={!!errors.destinationAddress?.city} px="2px">
          <FormLabel fontSize="sm">City</FormLabel>
          <Tooltip
            isDisabled={!errors.destinationAddress?.city}
            label={errors.destinationAddress?.city?.message}
            bg="red.500"
          >
            <Input
              id="destinationAddress.city"
              sx={{
                ...(errors.destinationAddress?.city
                  ? styles.error
                  : styles.base),
              }}
              _focus={{
                ...(errors.destinationAddress?.city
                  ? styles.focus.error
                  : styles.focus.base),
              }}
              {...register('destinationAddress.city', {
                required: {
                  value: true,
                  message: 'Required',
                },
                maxLength: {
                  value: 80,
                  message: 'Maximum length is 80',
                },
              })}
            />
          </Tooltip>
        </FormControl>
        <FormControl isInvalid={!!errors.destinationAddress?.state} px="2px">
          <FormLabel fontSize="sm">State / Province</FormLabel>
          <Tooltip
            isDisabled={!errors.destinationAddress?.state}
            label={errors.destinationAddress?.state?.message}
            bg="red.500"
          >
            <Select
              id="destinationAddress.state"
              _focus={{
                ...styles.focus.base,
              }}
              {...register('destinationAddress.state')}
            >
              {Object.keys(states).map((state) => {
                return (
                  <option key={state} value={state}>
                    {state}
                  </option>
                )
              })}
            </Select>
          </Tooltip>
        </FormControl>
        <FormControl isInvalid={!!errors.destinationAddress?.zip} px="2px">
          <FormLabel htmlFor="destinationAddress.zip" fontSize="sm">
            ZIP / Postal
          </FormLabel>
          <Tooltip
            isDisabled={!errors.destinationAddress?.zip}
            label={errors.destinationAddress?.zip?.message}
            bg="red.500"
          >
            <Input
              id="destinationAddress.zip"
              sx={{
                ...(errors.destinationAddress?.zip
                  ? styles.error
                  : styles.base),
              }}
              _focus={{
                ...(errors.destinationAddress?.zip
                  ? styles.focus.error
                  : styles.focus.base),
              }}
              {...register('destinationAddress.zip', {
                required: {
                  value: true,
                  message: 'Required',
                },
                maxLength: {
                  value: 15,
                  message: 'Maximum length is 15',
                },
              })}
            />
          </Tooltip>
        </FormControl>
      </HStack>
    </>
  )
}
