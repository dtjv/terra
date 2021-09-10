import { format } from 'date-fns'
import {
  Box,
  Flex,
  Tag,
  TagLabel,
  TagRightIcon,
  VStack,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { combineDateTime } from '@/lib/utils'
import type { Vehicle } from '@/types/types'

export interface ScheduledAppt {
  vehicleKey: string
  vehicles: Vehicle[]
  scheduledAt: string | Date
  scheduledTime: string
}

export const ScheduledAppt = ({
  vehicleKey = '',
  vehicles,
  scheduledAt,
  scheduledTime,
}: ScheduledAppt) => {
  const vehicle = vehicles.find((v) => v.vehicleKey === vehicleKey)

  if (!vehicle) {
    return <Box fontWeight="semibold">No appointment booked.</Box>
  }

  const scheduledAtFull = combineDateTime(new Date(scheduledAt), scheduledTime)

  return (
    <VStack align="flex-start">
      <Tag size="sm" variant="solid" colorScheme="teal">
        <TagLabel>{vehicle.vehicleName}</TagLabel>
        <TagRightIcon as={CheckIcon} boxSize={4} />
      </Tag>
      <Flex d="column" align="flex-start">
        <Box fontSize="3xl" fontWeight="bold">
          {format(scheduledAtFull, 'h:mm a')}
        </Box>
        <Box fontWeight="medium" sx={{ marginTop: '-5px' }}>
          {format(scheduledAtFull, 'eeee, MMMMMM d, yyyy')}
        </Box>
      </Flex>
    </VStack>
  )
}
