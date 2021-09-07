import phone from 'phone'
import {
  Input,
  VStack,
  HStack,
  Heading,
  Tooltip,
  FormLabel,
  FormControl,
} from '@chakra-ui/react'
import { FaUser } from 'react-icons/fa'
import { parseOneAddress } from 'email-addresses'
import { DestinationAddress } from '@/components/ticket/form'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

export const contactTab = { label: 'Contact Details', icon: FaUser }

export const StepContact = (form: UseFormReturn<TicketInput>) => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <VStack w="100%" align="flex-start" spacing={4}>
      <Heading fontSize="2xl" fontWeight="black" letterSpacing="tight" mb={4}>
        Please complete contact details.
      </Heading>
      <VStack align="flex-start" spacing={4}>
        <HStack spacing={4} w="100%">
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor="firstName" fontSize="sm">
              First name
            </FormLabel>
            <Tooltip
              isDisabled={!errors.firstName}
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
            <Tooltip
              isDisabled={!errors.lastName}
              label={errors.lastName?.message}
              bg="red.500"
            >
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
                    message: 'Required',
                  },
                })}
              />
            </Tooltip>
          </FormControl>
        </HStack>
        <HStack spacing={4} w="100%">
          <FormControl>
            <FormLabel fontSize="sm">Email</FormLabel>
            <Tooltip
              isDisabled={!errors.email}
              label={errors.email?.message}
              bg="red.500"
            >
              <Input
                id="email"
                type="email"
                placeholder="joe@example.com"
                sx={{
                  ...(errors.email
                    ? {
                        borderLeftWidth: '10px',
                      }
                    : null),
                }}
                _focus={{
                  ...(errors['email']
                    ? {
                        borderColor: 'red.500',
                      }
                    : {
                        border: '2px solid',
                        borderColor: 'purple.200',
                        bg: 'purple.50',
                      }),
                }}
                {...register('email', {
                  validate: {
                    emailFormat: (value: string) =>
                      value
                        ? !!parseOneAddress(value) || 'Invalid format'
                        : true,
                  },
                })}
              />
            </Tooltip>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Phone</FormLabel>
            <Tooltip
              isDisabled={!errors.phone}
              label={errors.phone?.message}
              bg="red.500"
            >
              <Input
                id="phone"
                type="tel"
                placeholder="xxx-xxx-xxxx"
                {...register('phone', {
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: {
                    phoneFormat: (value: string) =>
                      phone(value).isValid || 'Invalid format',
                  },
                })}
              />
            </Tooltip>
          </FormControl>
        </HStack>
        <DestinationAddress {...form} />
      </VStack>
    </VStack>
  )
}
