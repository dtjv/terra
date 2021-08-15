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

export const ScheduleNav = () => {
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
              />
              <IconButton
                variant="ghost"
                fontSize="1.5rem"
                aria-label="Next Day"
                icon={<ChevronRightIcon />}
              />
            </Flex>
            <Heading as="h3" size="md">
              August 13, 2021{' '}
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
