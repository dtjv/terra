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
  Button,
  Select,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import type { UseFormReturn } from 'react-hook-form'
import { ScheduleAt, DestinationAddress } from '@/components/ticket'
import { TicketFormSchema } from '@/schemas'
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
    resolver: superstructResolver(TicketFormSchema, { coerce: true }),
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
      preserveScrollBarGap
      size="xl"
      isCentered
      scrollBehavior="inside"
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
                  <VStack align="flex-start" spacing={8}>
                    <Box w="100%">
                      <Text fontSize="sm" fontWeight="semibold" mb={4}>
                        Tuesday, August 19, 2021
                      </Text>
                      <VStack
                        align="flex-start"
                        spacing={4}
                        w="100%"
                        divider={<StackDivider borderColor="gray.200" />}
                      >
                        <HStack spacing={4} w="100%">
                          <Flex w="25%" fontSize="sm" color="gray.500">
                            Truck 102
                          </Flex>
                          <SimpleGrid columns={4} spacing={2}>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                          </SimpleGrid>
                        </HStack>
                        <HStack spacing={4} w="100%">
                          <Flex w="25%" fontSize="sm" color="gray.500">
                            Truck 202
                          </Flex>
                          <SimpleGrid columns={4} spacing={2}>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                          </SimpleGrid>
                        </HStack>
                      </VStack>
                    </Box>
                    <Box w="100%">
                      <Text fontSize="sm" fontWeight="semibold" mb={4}>
                        Wednesday, August 20, 2021
                      </Text>
                      <VStack
                        align="flex-start"
                        spacing={4}
                        w="100%"
                        divider={<StackDivider borderColor="gray.200" />}
                      >
                        <HStack spacing={4} w="100%">
                          <Flex w="25%" fontSize="sm" color="gray.500">
                            Truck 102
                          </Flex>
                          <SimpleGrid columns={4} spacing={2}>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              10:00am
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              12:00pm
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              1:00pm
                            </Flex>
                          </SimpleGrid>
                        </HStack>
                        <HStack spacing={4} w="100%">
                          <Flex w="25%" fontSize="sm" color="gray.500">
                            Truck 202
                          </Flex>
                          <SimpleGrid columns={4} spacing={2}>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                            <Flex
                              fontSize="sm"
                              borderRadius="md"
                              borderWidth="1px"
                              justify="center"
                              p={2}
                            >
                              8:00am
                            </Flex>
                          </SimpleGrid>
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </VStack>

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
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
