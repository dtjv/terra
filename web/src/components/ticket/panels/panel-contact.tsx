import {
  Input,
  VStack,
  HStack,
  Heading,
  Box,
  Tooltip,
  FormLabel,
  FormControl,
} from '@chakra-ui/react'
import { FaUser } from 'react-icons/fa'
import { FieldDestinationAddress } from '@/components/ticket/fields'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

export const TabContact = { label: 'Contact Details', icon: FaUser }

export const PanelContact = (form: UseFormReturn<TicketInput>) => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Box pt={10}>
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
          <FieldDestinationAddress {...form} />
        </VStack>
      </VStack>
    </Box>
  )
}
