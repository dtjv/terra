import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Box,
  Text,
  VStack,
  HStack,
  Heading,
  Input,
  Button,
  Select,
  FormLabel,
  FormControl,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import { ScheduleAt, DestinationAddress } from '@/components/ticket'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

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
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
                <FormControl isInvalid={!!errors.ticketKind} isRequired>
                  <FormLabel htmlFor="ticketKind">Ticket type</FormLabel>
                  <Select id="ticketKind" {...register('ticketKind')}>
                    <option value={TicketKind.DELIVERY}>Delivery</option>
                    <option value={TicketKind.PICKUP}>Pickup</option>
                  </Select>
                </FormControl>
              </VStack>
              <VStack w="100%" align="flex-start" spacing={4}>
                <Heading size="md">Personal Information</Heading>
                <Box p={4} bg="white" borderRadius="md" boxShadow="base">
                  <VStack align="flex-start" spacing={4}>
                    <HStack spacing={4} w="100%">
                      <FormControl isInvalid={!!errors.firstName}>
                        <FormLabel htmlFor="firstName" fontSize="sm">
                          First name
                        </FormLabel>
                        <Tooltip
                          isDisabled={!Boolean(errors.firstName)}
                          label={errors.firstName?.message}
                          bg="red.500"
                        >
                          <Input
                            id="firstName"
                            sx={{
                              ...(errors['firstName']
                                ? {
                                    borderLeftWidth: '10px',
                                  }
                                : null),
                            }}
                            _focus={{
                              ...(errors['firstName']
                                ? {
                                    borderColor: 'red.500',
                                  }
                                : {
                                    border: '2px solid',
                                    borderColor: 'purple.200',
                                    bg: 'purple.50',
                                  }),
                            }}
                            {...register('firstName', {
                              required: {
                                value: true,
                                message: 'Required',
                              },
                            })}
                          />
                        </Tooltip>
                      </FormControl>
                      <FormControl isInvalid={!!errors.lastName}>
                        <FormLabel htmlFor="lastName" fontSize="sm">
                          Last name
                        </FormLabel>
                        <Input
                          id="lastName"
                          sx={{
                            ...(errors.lastName
                              ? {
                                  borderLeftWidth: '10px',
                                }
                              : null),
                          }}
                          _focus={{
                            ...(errors['lastName']
                              ? {
                                  borderColor: 'red.500',
                                }
                              : {
                                  border: '2px solid',
                                  borderColor: 'purple.200',
                                  bg: 'purple.50',
                                }),
                          }}
                          {...register('lastName', {
                            required: {
                              value: true,
                              message: 'Last name is required',
                            },
                          })}
                        />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} w="100%">
                      <FormControl>
                        <FormLabel fontSize="sm">Email</FormLabel>
                        <Input id="email" {...register('email')} />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Phone</FormLabel>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="xxx-xxx-xxxx"
                          {...register('phone')}
                        />
                      </FormControl>
                    </HStack>

                    <DestinationAddress {...form} />
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
                <ScheduleAt {...form} />
              </VStack>
            </VStack>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
              isDisabled={isSubmitting}
            >
              Create Ticket
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
