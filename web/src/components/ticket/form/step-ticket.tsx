import {
  Flex,
  Icon,
  VStack,
  Box,
  SimpleGrid,
  Heading,
  FormControl,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { FaTicketAlt } from 'react-icons/fa'
import { useController } from 'react-hook-form'
import { GiMineTruck, GiDigDug } from 'react-icons/gi'
import { TicketKind } from '@/types/enums'
import type { UseFormReturn } from 'react-hook-form'
import type { UseRadioProps } from '@chakra-ui/react'
import type { TicketInput } from '@/types/types'

const TicketKindCard = (
  props: UseRadioProps & { children?: React.ReactNode }
) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getCheckboxProps()
  const styles = {
    color: 'gray.700',
    borderColor: 'purple.600',
  }

  return (
    <Box as="label" flex="1">
      <input {...input} />
      <VStack
        {...checkbox}
        cursor="pointer"
        color="gray.500"
        borderWidth="1px"
        borderRadius="2xl"
        borderColor="gray.300"
        _checked={styles}
        _hover={styles}
        _focus={styles}
      >
        {props.children}
      </VStack>
    </Box>
  )
}

const choices = [
  {
    value: TicketKind.DELIVERY,
    icon: GiMineTruck,
    color: 'teal.500',
  },
  {
    value: TicketKind.PICKUP,
    icon: GiDigDug,
    color: 'teal.500',
  },
]

export const ticketTab = { label: 'Type of Ticket', icon: FaTicketAlt }

export const StepTicket = ({ control }: UseFormReturn<TicketInput>) => {
  const name = 'ticketKind'
  const {
    field,
    formState: { errors },
  } = useController({ control, name })
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value: field.value,
    onChange: field.onChange,
  })
  const group = getRootProps()

  return (
    <FormControl isInvalid={!!errors[name]}>
      <Heading fontSize="2xl" fontWeight="black" letterSpacing="tight">
        What service do you need?
      </Heading>
      <SimpleGrid columns={choices.length} spacing={8} {...group} mt={8}>
        {choices.map(({ value, icon, color }) => {
          const radio = getRadioProps({ value })
          return (
            <TicketKindCard key={value} {...radio}>
              <Flex py={8} align="center" direction="column">
                <Icon as={icon} boxSize={16} color={color} />
                <Flex mt={6} fontSize="md" fontWeight="semibold">
                  {value}
                </Flex>
              </Flex>
            </TicketKindCard>
          )
        })}
      </SimpleGrid>
    </FormControl>
  )
}
