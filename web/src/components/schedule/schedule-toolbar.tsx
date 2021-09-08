import { useRouter } from 'next/router'
import {
  Box,
  HStack,
  Button,
  Skeleton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'

export interface ScheduleToolbarProps {
  isLoading: boolean
  isPastSchedule: boolean
}

export const ScheduleToolbar = ({
  isLoading,
  isPastSchedule,
}: ScheduleToolbarProps) => {
  const router = useRouter()
  const backgroundColor = useColorModeValue('whiteAlpha.900', 'gray.600')
  const placeholderColor = useColorModeValue('gray.400', 'whiteAlpha.700')
  const handleOnClick = (href: string) => {
    router.push(href)
  }

  return (
    <Box py={8}>
      <HStack spacing={6}>
        <Skeleton isLoaded={!isLoading}>
          <Button
            px={6}
            fontWeight="normal"
            leftIcon={<AddIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={() => handleOnClick('/admin/delivery/create-ticket')}
            isDisabled={isPastSchedule}
          >
            Create Ticket
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
    </Box>
  )
}
