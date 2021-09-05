import {
  Flex,
  Icon,
  VStack,
  Box,
  SimpleGrid,
  FormLabel,
  FormControl,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { useController } from 'react-hook-form'
import { FaTicketAlt } from 'react-icons/fa'
import { GiMineTruck, GiDigDug } from 'react-icons/gi'
import type { UseRadioProps } from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

function RadioCard(props: UseRadioProps & { children?: React.ReactNode }) {
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
        fontWeight="semibold"
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

const radioOptions = [
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

export const TabTicket = { label: 'Type of Ticket', icon: FaTicketAlt }

export const PanelTicket = ({ control }: UseFormReturn<TicketInput>) => {
  const name = 'ticketKind'
  const {
    field,
    formState: { errors },
  } = useController({
    control,
    name,
    rules: { required: { value: true, message: 'Required field' } },
  })
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value: field.value,
    onChange: field.onChange,
  })
  const group = getRootProps()

  return (
    <Box pt={10}>
      <FormControl isInvalid={!!errors[name]}>
        <FormLabel fontSize="2xl" fontWeight="black" letterSpacing="tight">
          What ticket do you want to create?
        </FormLabel>
        <SimpleGrid columns={radioOptions.length} spacing={4} {...group} mt={8}>
          {radioOptions.map(({ value, icon, color }) => {
            const radio = getRadioProps({ value })
            return (
              <RadioCard key={value} {...radio}>
                <Flex py={8} align="center" direction="column">
                  <Icon as={icon} boxSize={12} color={color} />
                  <Flex mt={6} fontSize="sm">
                    {value}
                  </Flex>
                </Flex>
              </RadioCard>
            )
          })}
        </SimpleGrid>
      </FormControl>
    </Box>
  )
}
