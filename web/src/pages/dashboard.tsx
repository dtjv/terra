import * as React from 'react'
import {
  Button,
  Text,
  Box,
  Flex,
  Stack,
  StackDivider,
  HStack,
  useColorMode,
} from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'

const ToggleColorMode: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </header>
  )
}

const Dashboard: React.FC = () => {
  return (
    <Flex h="100vh" position="relative">
      <Box w="2xs" h="100%">
        <Flex direction="column" h="100%">
          <Box bg="gray.800" p={8} color="white" textAlign="center">
            terra
          </Box>
          <Box flex="1 1 0" pt={8} px={4}>
            <Stack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={4}
            >
              <Stack spacing={4}>
                <HStack
                  spacing={4}
                  cursor="pointer"
                  px={3}
                  py={2}
                  borderRadius="md"
                  bg="gray.700"
                  color="white"
                >
                  <InfoIcon />
                  <Text> Dashboard </Text>
                </HStack>
                <HStack
                  spacing={4}
                  cursor="pointer"
                  px={3}
                  py={2}
                  borderRadius="md"
                  _hover={{
                    bg: 'gray.700',
                    color: 'white',
                  }}
                  transition="all 0.3s ease 0s"
                >
                  <InfoIcon />
                  <Text> Dashboard </Text>
                </HStack>
              </Stack>
              <Stack spacing={4}>
                <Box>Notifications</Box>
                <Box>Settings</Box>
              </Stack>
            </Stack>
          </Box>
          <Box bg="gray.800" p={8} color="white" textAlign="center">
            joe user
          </Box>
        </Flex>
      </Box>
      <Flex flex="1 1 0" align="center" justifyContent="center">
        <ToggleColorMode />
      </Flex>
    </Flex>
  )
}

export default Dashboard
