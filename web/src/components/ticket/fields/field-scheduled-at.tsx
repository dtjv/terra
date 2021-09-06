import * as React from 'react'
import axios from 'axios'
import { set, format } from 'date-fns'
import { groupBy } from 'lodash'
import { useEffect, useState, useContext } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Icon,
  Box,
  Flex,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Stack,
  FormControl,
  Input,
  SimpleGrid,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { GiMineTruck } from 'react-icons/gi'
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

const TimeCard = (props: UseRadioProps & { children?: React.ReactNode }) => {
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
          bg: 'purple.500',
          color: 'white',
          borderColor: 'purple.500',
        }}
        _hover={{
          bg: 'purple.500',
          color: 'white',
          borderColor: 'purple.500',
        }}
        _focus={{
          borderColor: 'purple.500',
        }}
      >
        {props.children}
      </Flex>
    </Box>
  )
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
  const group = getRootProps()
  const slotsByVehicle = groupBy(availableSlots, (item) => item['vehicleKey'])

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
  console.log(availableSlots)

  // TODO: listing ALL vehicles, whether we have slots for each or not. wrong!!
  return (
    <Box {...group}>
      <FormControl>
        <Input
          id="scheduledAt"
          display="none"
          {...register('scheduledAt', {
            required: { value: true, message: 'Choose a Time' },
          })}
        />
      </FormControl>
      <Tabs variant="unstyled" w="100%">
        <TabList d="flex" justifyContent="center">
          {vehicles.map((vehicle, idx) => (
            <Tab
              key={idx}
              flex="1"
              p={4}
              color="gray.500"
              borderWidth="1px"
              borderRadius="2xl"
              display="flex"
              flexDirection="column"
              ml={idx === 0 ? 0 : 4}
              _focus={{}}
              _hover={{ borderColor: 'purple.600' }}
              _selected={{
                color: 'gray.700',
                borderColor: 'purple.600',
              }}
            >
              <Icon as={GiMineTruck} boxSize={16} color="teal.500" />
              <Text fontSize="sm" fontWeight="semibold">
                {vehicle.vehicleName}
              </Text>
            </Tab>
          ))}
        </TabList>
        <TabPanels mt={8}>
          {Object.values(slotsByVehicle).map((vehicleSlots, i) => {
            const slotsByMonth = groupBy(vehicleSlots, (slot) =>
              format(new Date(slot['scheduledAt']), 'MMMM')
            )
            return (
              <TabPanel key={i} p={0}>
                <Stack direction="column" spacing={8}>
                  {Object.entries(slotsByMonth).map(
                    ([month, availableSlots], j) => {
                      const slotsByDate = groupBy(
                        availableSlots,
                        (slot) => slot['scheduledAt']
                      )

                      return (
                        <Box key={j}>
                          <Flex fontWeight="semibold">{month}</Flex>
                          <Stack mt={4} direction="column" spacing={4}>
                            {Object.entries(slotsByDate).map(
                              ([date, slotsForDate], k) => {
                                return (
                                  <Flex
                                    key={k}
                                    w="100%"
                                    py={4}
                                    borderWidth="1px"
                                    borderRadius="2xl"
                                  >
                                    <Flex
                                      direction="column"
                                      align="center"
                                      justify="center"
                                      px={6}
                                    >
                                      <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        fontWeight="semibold"
                                      >
                                        {format(
                                          new Date(date),
                                          'eee'
                                        ).toUpperCase()}
                                      </Text>
                                      <Flex
                                        w="40px"
                                        h="40px"
                                        align="center"
                                        justify="center"
                                        bg="purple.50"
                                        color="purple.600"
                                        fontSize="xl"
                                        fontWeight="semibold"
                                        borderRadius="full"
                                      >
                                        {format(new Date(date), 'd')}
                                      </Flex>
                                    </Flex>
                                    <Flex flex="1" px={6} align="center">
                                      <SimpleGrid columns={5} spacing={3}>
                                        {slotsForDate.map(
                                          (timeSlot: AvailableSlot) => {
                                            const radio = getRadioProps({
                                              value: JSON.stringify({
                                                ...timeSlot,
                                              }),
                                            })
                                            return (
                                              <TimeCard
                                                key={timeSlot.key}
                                                {...radio}
                                              >
                                                {format(
                                                  new Date(
                                                    timeSlot.scheduledAtFull
                                                  ),
                                                  'hh:mm aa'
                                                )}
                                              </TimeCard>
                                            )
                                          }
                                        )}
                                      </SimpleGrid>
                                    </Flex>
                                  </Flex>
                                )
                              }
                            )}
                          </Stack>
                        </Box>
                      )
                    }
                  )}
                </Stack>
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </Box>
  )
}
