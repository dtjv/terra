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
import { styles, DestinationAddress } from '@/components/ticket/form'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

export const contactTab = { label: 'Contact Details', icon: FaUser }

export const StepContact = (form: UseFormReturn<TicketInput>) => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <VStack w="full" align="flex-start" spacing={4}>
      <Heading fontSize="2xl" fontWeight="black" letterSpacing="tight" mb={4}>
        Please complete contact details.
      </Heading>
      <VStack w="full" align="flex-start" spacing={4}>
        <HStack w="full" spacing={4}>
          <FormControl isInvalid={!!errors.firstName} px="2px">
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
                  ...(errors.firstName ? styles.error : styles.base),
                }}
                _focus={{
                  ...(errors.firstName
                    ? styles.focus.error
                    : styles.focus.base),
                }}
                {...register('firstName', {
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
          <FormControl isInvalid={!!errors.lastName} px="2px">
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
                  ...(errors.lastName ? styles.error : styles.base),
                }}
                _focus={{
                  ...(errors.lastName ? styles.focus.error : styles.focus.base),
                }}
                {...register('lastName', {
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
        </HStack>
        <HStack spacing={4} w="100%">
          <FormControl isInvalid={!!errors.email} px="2px">
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
                  ...(errors.email ? styles.error : styles.base),
                }}
                _focus={{
                  ...(errors.email ? styles.focus.error : styles.focus.base),
                }}
                {...register('email', {
                  validate: {
                    emailFormat: (value: string) =>
                      value
                        ? !!parseOneAddress(value) || 'Invalid format'
                        : true,
                  },
                  maxLength: {
                    value: 100,
                    message: 'Maximum length is 100',
                  },
                })}
              />
            </Tooltip>
          </FormControl>
          <FormControl isInvalid={!!errors.phone} px="2px">
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
                sx={{
                  ...(errors.phone ? styles.error : styles.base),
                }}
                _focus={{
                  ...(errors.phone ? styles.focus.error : styles.focus.base),
                }}
                {...register('phone', {
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: {
                    phoneFormat: (value: string) =>
                      phone(value).isValid || 'Invalid format',
                  },
                  maxLength: {
                    value: 12,
                    message: 'Maximum length is 12',
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
