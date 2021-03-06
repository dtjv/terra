import hexAlpha from 'hex-alpha'
import { useRouter } from 'next/router'
import { add, sub, format } from 'date-fns'
import {
  Button,
  Spacer,
  Box,
  Flex,
  HStack,
  IconButton,
  Heading,
  useColorModeValue,
  Skeleton,
  useToken,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

export interface ScheduleNavProps {
  isLoading: boolean
  scheduledAt: Date
  isPastSchedule: boolean
  setScheduledAt: (date: Date) => void
}

export const ScheduleNav = ({
  isLoading,
  scheduledAt,
  isPastSchedule,
  setScheduledAt,
}: ScheduleNavProps) => {
  const router = useRouter()
  const teal600 = useToken('colors', 'teal.600')
  const teal600a5 = hexAlpha(teal600, 0.5)
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.400')
  const backgroundColor = useColorModeValue('whiteAlpha.700', 'gray.800')
  const handleOnClick = (href: string) => {
    router.push(href)
  }

  return (
    <Box
      py={4}
      px={8}
      mx="auto"
      maxW="6xl"
      bg={backgroundColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
    >
      <Flex>
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Skeleton isLoaded={!isLoading}>
              <IconButton
                variant="ghost"
                fontSize="1.5rem"
                aria-label="Previous Day"
                icon={<ChevronLeftIcon />}
                _focus={{
                  bg: 'gray.100',
                }}
                onClick={() => setScheduledAt(sub(scheduledAt, { days: 1 }))}
              />
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <IconButton
                variant="ghost"
                fontSize="1.5rem"
                aria-label="Next Day"
                icon={<ChevronRightIcon />}
                _focus={{
                  bg: 'gray.100',
                }}
                onClick={() => setScheduledAt(add(scheduledAt, { days: 1 }))}
              />
            </Skeleton>
          </HStack>
          <Skeleton isLoaded={!isLoading}>
            <Heading as="h3" size="md">
              {format(scheduledAt, 'MMMM d, yyyy')}
            </Heading>
          </Skeleton>
        </HStack>
        <Spacer />
        <Skeleton isLoaded={!isLoading}>
          <Button
            px={6}
            colorScheme="teal"
            onClick={() => handleOnClick('/admin/delivery/new-ticket')}
            isDisabled={isPastSchedule}
            _focus={{
              boxShadow: `0 0 0 3px ${teal600a5}`,
            }}
          >
            Create Ticket
          </Button>
        </Skeleton>
      </Flex>
    </Box>
  )
}
