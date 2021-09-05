import axios from 'axios'
import { set, format } from 'date-fns'
import { groupBy } from 'lodash'
import { useEffect, useState, useContext } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  FormControl,
  Input,
  Tooltip,
  StackDivider,
  SimpleGrid,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import type { UseRadioProps } from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import { ScheduleContext } from '@/hooks/use-schedule'
import type { TicketInput } from '@/types/types'

interface AvailableSlot {
  key: number
  vehicleKey: string
  scheduledAt: Date
  scheduledTime: string
  scheduledAtFull: Date
}

const TimeSlot = (props: UseRadioProps & { children?: React.ReactNode }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" d="block">
      <input {...input} />
      <Flex
        {...checkbox}
        p={2}
        cursor="pointer"
        fontSize="sm"
        justify="center"
        borderRadius="md"
        borderWidth="1px"
        _checked={{
          bg: 'purple.100',
          color: 'gray.700',
          borderColor: 'purple.100',
        }}
        _hover={{
          bg: 'purple.100',
          color: 'gray.700',
          borderColor: 'purple.100',
        }}
        _focus={{
          borderColor: 'purple.200',
        }}
      >
        {props.children}
      </Flex>
    </Box>
  )
}

interface Hash {
  [key: string]: { [key: string]: AvailableSlot[] }
}

export const FieldScheduledAt = ({
  control,
  register,
  setValue,
  clearErrors,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const { vehicles } = useContext(ScheduleContext)
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'scheduledAt',
    onChange: (value) => {
      const { vehicleKey, scheduledTime, scheduledAt } = JSON.parse(value)
      setValue('scheduledAt', new Date(scheduledAt))
      setValue('vehicleKey', vehicleKey)
      setValue('scheduledTime', scheduledTime)
      clearErrors(['scheduledAt', 'vehicleKey', 'scheduledTime'])
    },
  })
  const slotsByVehicle = groupBy(availableSlots, (item) => item['scheduledAt'])
  const slotsByDateByVehicle = Object.entries(slotsByVehicle).reduce(
    (hash, [k, v]) => {
      hash[k] = groupBy(v, (item) => item['vehicleKey'])
      return hash
    },
    {} as Hash
  )
  const group = getRootProps()

  useEffect(() => {
    const axiosSource = axios.CancelToken.source()

    ;(async () => {
      if (durationInMinutes && !errors.durationInMinutes) {
        const today = new Date()
        const currentDate = set(today, {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })
        const currentTime = format(today, 'HH:mm:ss.SSS')

        try {
          const { data } = await axios.post(
            '/api/schedule',
            {
              vehicleKeys: vehicles.map((v) => v.vehicleKey),
              currentDate,
              currentTime,
              requestDate: undefined, // not used now. future feature.
              durationInMinutes: 30,
            },
            {
              cancelToken: axiosSource.token,
            }
          )
          setAvailableSlots(data as AvailableSlot[])
        } catch (error) {
          if (axios.isCancel(error)) {
            throw error
          }
        }
      }
    })()
    return () => axiosSource.cancel()
  }, [vehicles, durationInMinutes, errors.durationInMinutes])

  if (!availableSlots.length) {
    return (
      <Text w="100%" color="gray.500" fontSize="sm">
        No dates available.
      </Text>
    )
  }

  return (
    <Tooltip
      isDisabled={!errors.scheduledAt}
      label={errors.scheduledAt?.message}
      bg="red.500"
    >
      <Box
        p={4}
        w="100%"
        bg="white"
        borderRadius="md"
        boxShadow={
          errors.scheduledAt ? '0 0 0 3px rgba(229, 62, 62, 1)' : 'base'
        }
      >
        <VStack align="flex-start" spacing={8} {...group}>
          <FormControl>
            <Input
              id="scheduledAt"
              display="none"
              {...register('scheduledAt', {
                required: { value: true, message: 'Choose a Time' },
              })}
            />
          </FormControl>
          {Object.entries(slotsByDateByVehicle).map(
            ([date, slotsByVehicle], i) => {
              return (
                <Box key={i} w="100%">
                  <Text fontSize="sm" fontWeight="semibold" mb={4}>
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </Text>
                  <VStack
                    align="flex-start"
                    spacing={4}
                    w="100%"
                    divider={<StackDivider borderColor="gray.200" />}
                  >
                    {Object.entries(slotsByVehicle).map(
                      ([vehicleKey, timeSlots], j) => {
                        const vehicle = vehicles.find(
                          (vehicle) => vehicle.vehicleKey === vehicleKey
                        )
                        return (
                          <HStack key={`${i}-${j}`} spacing={4} w="100%">
                            <Flex w="25%" fontSize="sm" color="gray.500">
                              {vehicle?.vehicleName ??
                                `Unknown key: ${vehicleKey}`}
                            </Flex>
                            <SimpleGrid columns={4} spacing={2}>
                              {timeSlots.map((time: AvailableSlot) => {
                                const radio = getRadioProps({
                                  value: JSON.stringify({ ...time }),
                                })
                                return (
                                  <TimeSlot key={time.key} {...radio}>
                                    {format(
                                      new Date(time.scheduledAtFull),
                                      'hh:mm aa'
                                    )}
                                  </TimeSlot>
                                )
                              })}
                            </SimpleGrid>
                          </HStack>
                        )
                      }
                    )}
                  </VStack>
                </Box>
              )
            }
          )}
        </VStack>
      </Box>
    </Tooltip>
  )
}
