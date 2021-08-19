import {
  Box,
  HStack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import { TicketCreateModal } from '@/components/ticket/ticket-create-modal'

export const ScheduleToolbar = () => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const backgroundColor = useColorModeValue('whiteAlpha.900', 'gray.600')
  const placeholderColor = useColorModeValue('gray.400', 'whiteAlpha.700')

  return (
    <Box py={8}>
      <HStack spacing={6}>
        <Button
          px={6}
          fontWeight="normal"
          leftIcon={<AddIcon />}
          colorScheme="teal"
          variant="solid"
          onClick={onOpen}
        >
          Create
        </Button>
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
      </HStack>
      <TicketCreateModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
