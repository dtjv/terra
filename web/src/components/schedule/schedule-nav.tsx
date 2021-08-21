import { add, sub, format } from 'date-fns'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Heading,
  Spacer,
  Select,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

export interface ScheduleNavProps {
  scheduledAt: Date
  setScheduledAt: (date: Date) => void
}

export const ScheduleNav = ({
  scheduledAt,
  setScheduledAt,
}: ScheduleNavProps) => {
  const backgroundColor = useColorModeValue('whiteAlpha.700', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.400')

  return (
    <Box
      py={4}
      px={16}
      mx="auto"
      maxW="6xl"
      bg={backgroundColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
    >
      <Flex>
        <Flex>
          <HStack spacing={4}>
            <Flex>
              <IconButton
                variant="ghost"
                fontSize="1.5rem"
                aria-label="Previous Day"
                icon={<ChevronLeftIcon />}
                onClick={() => setScheduledAt(sub(scheduledAt, { days: 1 }))}
              />
              <IconButton
                variant="ghost"
                fontSize="1.5rem"
                aria-label="Next Day"
                icon={<ChevronRightIcon />}
                onClick={() => setScheduledAt(add(scheduledAt, { days: 1 }))}
              />
            </Flex>
            <Heading as="h3" size="md">
              {format(scheduledAt, 'MMMM d, yyyy')}
            </Heading>
          </HStack>
        </Flex>
        <Spacer />
        <Box>
          <Select placeholder="Day" variant="outline">
            <option value="week">Week</option>
          </Select>
        </Box>
      </Flex>
    </Box>
  )
}
