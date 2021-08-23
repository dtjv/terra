import dynamic from 'next/dynamic'
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

const TicketCreateModal = dynamic(async () => {
  const m = await import('../../components/ticket/ticket-create-modal')
  return m.TicketCreateModal
})

export interface ScheduleToolbarProps {
  isLoading: boolean
  isPastSchedule: boolean
}

export const ScheduleToolbar = ({
  isLoading,
  isPastSchedule,
}: ScheduleToolbarProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const backgroundColor = useColorModeValue('whiteAlpha.900', 'gray.600')
  const placeholderColor = useColorModeValue('gray.400', 'whiteAlpha.700')

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
            isDisabled={isPastSchedule}
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
