import {
  Box,
  HStack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'

export const ScheduleToolbar = () => {
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
    </Box>
  )
}
