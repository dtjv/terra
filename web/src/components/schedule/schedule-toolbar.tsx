import { set, isBefore } from 'date-fns'
import {
  Box,
  HStack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useDisclosure,
  Skeleton,
} from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import { TicketCreateModal } from '@/components/ticket/ticket-create-modal'

export interface ScheduleToolbarProps {
  isLoading: boolean
  scheduledAt: Date
}

export const ScheduleToolbar = ({
  isLoading,
  scheduledAt,
}: ScheduleToolbarProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const backgroundColor = useColorModeValue('whiteAlpha.900', 'gray.600')
  const placeholderColor = useColorModeValue('gray.400', 'whiteAlpha.700')
  const today = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

  return (
    <Box py={8}>
      <HStack spacing={6}>
        <Skeleton isLoaded={!isLoading}>
          <Button
            px={6}
            fontWeight="normal"
            leftIcon={<AddIcon />}
            colorScheme="teal"
            variant="solid"
            onClick={onOpen}
            isDisabled={isBefore(scheduledAt, today)}
          >
            Create
          </Button>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search"
              bg={backgroundColor}
              focusBorderColor="teal.500"
              _placeholder={{
                color: placeholderColor,
              }}
            />
          </InputGroup>
        </Skeleton>
      </HStack>
      <TicketCreateModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
