import { groupBy } from 'lodash'
import { format } from 'date-fns'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  SimpleGrid,
  StackDivider,
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Heading,
  Input,
  //  Button,
  //  Select,
  FormLabel,
  FormControl,
  //  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import type { UseRadioProps } from '@chakra-ui/react'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import type { UseFormReturn } from 'react-hook-form'
//import { ScheduleAt, DestinationAddress } from '@/components/ticket'
import { TicketFormSchema } from '@/schemas'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

// TODO: remove
import { combineDateTime } from '@/lib/utils'

interface AvailableSlot {
  key: number
  vehicleKey: string
  vehicleName: string
  scheduledAt: Date
  scheduledTime: string
  scheduledAtFull: Date
}

// TODO remove
const slots: AvailableSlot[] = [
  {
    key: 1,
    vehicleKey: '102',
    vehicleName: 'Truck 102',
    scheduledAt: new Date('2021-8-19'),
    scheduledTime: '08:00:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-19'), '08:00:00.000'),
  },
  {
    key: 2,
    vehicleKey: '102',
    vehicleName: 'Truck 102',
    scheduledAt: new Date('2021-8-19'),
    scheduledTime: '09:00:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-19'), '09:00:00.000'),
  },
  {
    key: 3,
    vehicleKey: '202',
    vehicleName: 'Truck 202',
    scheduledAt: new Date('2021-8-19'),
    scheduledTime: '08:30:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-19'), '08:30:00.000'),
  },
  {
    key: 4,
    vehicleKey: '202',
    vehicleName: 'Truck 202',
    scheduledAt: new Date('2021-8-19'),
    scheduledTime: '13:30:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-19'), '13:30:00.000'),
  },
  {
    key: 5,
    vehicleKey: '202',
    vehicleName: 'Truck 202',
    scheduledAt: new Date('2021-8-20'),
    scheduledTime: '08:00:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-20'), '08:00:00.000'),
  },
  {
    key: 6,
    vehicleKey: '302',
    vehicleName: 'Truck 302',
    scheduledAt: new Date('2021-8-20'),
    scheduledTime: '10:30:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-20'), '10:30:00.000'),
  },
  {
    key: 7,
    vehicleKey: '302',
    vehicleName: 'Truck 302',
    scheduledAt: new Date('2021-8-20'),
    scheduledTime: '11:00:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-20'), '11:00:00.000'),
  },
  {
    key: 8,
    vehicleKey: '302',
    vehicleName: 'Truck 302',
    scheduledAt: new Date('2021-8-20'),
    scheduledTime: '15:00:00.000',
    scheduledAtFull: combineDateTime(new Date('2021-8-20'), '15:00:00.000'),
  },
]

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

const TimesRadio = () => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'scheduledAt',
    onChange: console.log,
  })

  // TODO: i'm using hard-coded `slots` here...
  const slotsByVehicle = groupBy(slots, (item) => item['scheduledAt'])
  const data = Object.entries(slotsByVehicle).reduce((hash, [k, v]) => {
    hash[k] = groupBy(v, (item) => item['vehicleKey'])
    return hash
  }, {} as Hash)

  const group = getRootProps()

  return (
    <VStack align="flex-start" spacing={8} {...group}>
      {Object.entries(data).map(([date, slotsByVehicle], i) => {
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
                  return (
                    <HStack key={`${i}-${j}`} spacing={4} w="100%">
                      <Flex w="25%" fontSize="sm" color="gray.500">
                        {timeSlots.length
                          ? timeSlots[0]?.vehicleName
                          : vehicleKey}
                      </Flex>
                      <SimpleGrid columns={4} spacing={2}>
                        {timeSlots.map((time: AvailableSlot, k) => {
                          const key = `${i}-${j}-${k}`
                          const value = key + time.scheduledAt.toISOString()
                          const radio = getRadioProps({ value })
                          return (
                            <TimeSlot key={key} {...radio}>
                              {format(time.scheduledAtFull, 'hh:mm aa')}
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
      })}
    </VStack>
  )
}

export interface TicketCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TicketCreateModal = ({
  isOpen,
  onClose,
}: TicketCreateModalProps) => {
  const form: UseFormReturn<TicketInput> = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: { ticketKind: TicketKind.DELIVERY, scheduledTime: '' },
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
  })
  const {
    //    register,
    handleSubmit,
    reset,
    //    formState: { errors, isSubmitting },
  } = form
  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    // TODO: POST /api/tickets
    console.log(`input fields: `, fields)
    onClose()
    reset()
  }

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
      }}
    >
      <ModalOverlay />
      <ModalContent bg="gray.50">
        <ModalHeader fontSize="2xl">New Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody color="gray.700">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack align="flex-start" spacing={8}>
              <VStack w="100%" align="flex-start" spacing={4}>
                <Heading size="md">Personal Information</Heading>
                <Box p={4} bg="white" borderRadius="md" boxShadow="base">
                  <VStack align="flex-start" spacing={4}>
                    <HStack spacing={4} w="100%">
                      <FormControl>
                        <FormLabel fontSize="sm">First name</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Last name</FormLabel>
                        <Input />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} w="100%">
                      <FormControl>
                        <FormLabel fontSize="sm">Email</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Phone</FormLabel>
                        <Input type="tel" placeholder="xxx-xxx-xxxx" />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} w="100%">
                      <FormControl>
                        <FormLabel fontSize="sm">Street address</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl w="25%">
                        <FormLabel fontSize="sm">Unit No.</FormLabel>
                        <Input />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} w="100%">
                      <FormControl>
                        <FormLabel fontSize="sm">City</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">State / Province</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Zip / Postal</FormLabel>
                        <Input />
                      </FormControl>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
              <VStack w="100%" align="flex-start" spacing={4}>
                <Heading size="md">Product Information</Heading>
                <Box
                  p={4}
                  w="100%"
                  bg="white"
                  borderRadius="md"
                  boxShadow="base"
                >
                  <Text w="100%" color="gray.500" fontSize="sm">
                    TBD
                  </Text>
                </Box>
              </VStack>
              <VStack w="100%" align="flex-start" spacing={4}>
                <Heading size="md">Schedule Information</Heading>
                <Box
                  p={4}
                  w="100%"
                  bg="white"
                  borderRadius="md"
                  boxShadow="base"
                >
                  <TimesRadio />
                </Box>
              </VStack>
            </VStack>

            {/*
            <FormControl isInvalid={!!errors.ticketKind} isRequired>
              <FormLabel htmlFor="ticketKind">Ticket type</FormLabel>
              <Select id="ticketKind" {...register('ticketKind')}>
                <option value={TicketKind.DELIVERY}>Delivery</option>
                <option value={TicketKind.PICKUP}>Pickup</option>
              </Select>
              <FormErrorMessage>
                {errors?.ticketKind?.message ?? ''}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.customerName} isRequired>
              <FormLabel htmlFor="customerFirstName">Name</FormLabel>
              <Input id="customerName" {...register('customerName')} />
              <FormErrorMessage>
                {errors?.customerName?.message ?? ''}
              </FormErrorMessage>
            </FormControl>

            <DestinationAddress {...form} />

            <ScheduleAt {...form} />

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
              isDisabled={isSubmitting}
            >
              Submit
            </Button>
            */}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
