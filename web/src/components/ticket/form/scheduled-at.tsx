import * as React from 'react'
import axios from 'axios'
import { set, format } from 'date-fns'
import { groupBy } from 'lodash'
import { useEffect, useState, useContext } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Heading,
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
  Tooltip,
  FormControl,
  Input,
  SimpleGrid,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { GiMineTruck } from 'react-icons/gi'
import { InfoIcon } from '@chakra-ui/icons'
import { SCHEDULE_API } from '@/config/constants'
import { VehicleContext } from '@/contexts/vehicle-context'
import type { UseRadioProps } from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

const colorArray: { [key: string]: string } = {
  jan: 'blue.100',
  feb: 'green.100',
  mar: 'orange.100',
  apr: 'blue.100',
  may: 'green.100',
  jun: 'orange.100',
  jul: 'blue.100',
  aug: 'green.100',
  sep: 'orange.100',
  oct: 'blue.100',
  nov: 'green.100',
  dec: 'orange.100',
}

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
        bg="white"
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

export const ScheduledAt = ({
  control,
  register,
  setValue,
  trigger,
  clearErrors,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const { vehicles } = useContext(VehicleContext)
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'scheduledAt',
    onChange: async (value) => {
      const { vehicleKey, scheduledTime, scheduledAt } = JSON.parse(value)
      setValue('scheduledAt', new Date(scheduledAt))
      setValue('vehicleKey', vehicleKey)
      setValue('scheduledTime', scheduledTime)
      clearErrors(['scheduledAt', 'vehicleKey', 'scheduledTime'])
      await trigger() // resets `isValid`, since `clearErrors` does not.
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
            SCHEDULE_API,
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

  // TODO: listing ALL vehicles, whether we have slots for each or not. wrong!!
  return (
    <Box {...group}>
      <FormControl>
        <Input
          id="scheduledAt"
          display="none"
          {...register('scheduledAt', {
            required: { value: true, message: 'Please select a time.' },
          })}
        />
      </FormControl>
      {!availableSlots.length ? (
        <Text w="100%" color="gray.500" fontSize="sm">
          No dates available.
        </Text>
      ) : (
        <>
          <Heading fontSize="md" fontWeight="semibold">
            Vehicle Selection
          </Heading>
          <Tabs variant="unstyled" w="full" mt={4}>
            <TabList d="flex" justifyContent="center">
              {vehicles.map((vehicle, idx) => (
                <Tab
                  key={idx}
                  flex="1"
                  p={2}
                  color="gray.500"
                  borderWidth="1px"
                  borderRadius="xl"
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
                  <Icon as={GiMineTruck} boxSize={12} color="teal.500" />
                  <Text fontSize="sm" fontWeight="semibold">
                    {vehicle.vehicleName}
                  </Text>
                </Tab>
              ))}
            </TabList>
            <Stack direction="row" spacing={2} align="center" mt={8}>
              <Heading fontSize="md" fontWeight="semibold">
                Time Selection
              </Heading>
              {errors.scheduledAt ? (
                <Tooltip
                  isDisabled={!errors.scheduledAt}
                  label={errors.scheduledAt?.message}
                  bg="red.500"
                >
                  <InfoIcon w={4} h={4} color="red.500" />
                </Tooltip>
              ) : null}
            </Stack>
            <TabPanels mt={4}>
              {Object.values(slotsByVehicle).map((vehicleSlots, i) => {
                const slotsByDate = groupBy(
                  vehicleSlots,
                  (slot) => slot['scheduledAt']
                )
                return (
                  <TabPanel key={i} p={0}>
                    <Stack mt={4} direction="column" spacing={3}>
                      {Object.entries(slotsByDate).map(
                        ([date, slotsForDate], k) => {
                          const month = format(new Date(date), 'MMM')
                          return (
                            <Flex key={k} w="full">
                              <Flex
                                align="center"
                                minW="90px"
                                bg={colorArray[month.toLowerCase()]}
                                justify="center"
                                fontSize="xl"
                                fontWeight="normal"
                                borderLeftRadius="xl"
                              >
                                {month}
                              </Flex>
                              <Flex w="full" py={4} pr={4} bg="gray.50">
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
                                    bg="purple.100"
                                    color="gray.700"
                                    fontSize="xl"
                                    fontWeight="medium"
                                    borderRadius="full"
                                  >
                                    {format(new Date(date), 'd')}
                                  </Flex>
                                </Flex>
                                <Flex flex="1" align="center">
                                  <SimpleGrid
                                    columns={{
                                      sm: 2,
                                      md: 3,
                                      lg: 4,
                                      xl: 5,
                                    }}
                                    spacing={3}
                                    w="full"
                                  >
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
                            </Flex>
                          )
                        }
                      )}
                    </Stack>
                  </TabPanel>
                )
              })}
            </TabPanels>
          </Tabs>
        </>
      )}
    </Box>
  )
}
