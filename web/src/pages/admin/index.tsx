import * as React from 'react'
import NextLink from 'next/link'
import type { UrlObject } from 'url'
import { useRouter } from 'next/router'
import {
  Avatar,
  Button,
  Text,
  Box,
  Flex,
  Stack,
  StackDivider,
  HStack,
  useColorMode,
  Icon,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react'
import {
  FaLeaf,
  FaHome,
  FaTruck,
  FaDatabase,
  FaCog,
  FaBell,
  FaUserFriends,
  FaShoppingCart,
} from 'react-icons/fa'

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

// https://github.com/vercel/next.js/blob/canary/packages/next/client/link.tsx
interface LinkProps {
  href: string | UrlObject
}

const Link: React.FC<LinkProps> = (props) => {
  const { children, href, ...rest } = props
  const { pathname } = useRouter()
  const isActive = pathname === href

  return (
    <NextLink passHref href={href}>
      <ChakraLink
        bg={isActive ? 'gray.700' : 'inherit'}
        color={isActive ? 'white' : 'inherit'}
        {...rest}
      >
        {children}
      </ChakraLink>
    </NextLink>
  )
}

interface MenuItemProps {
  icon: any
  href: string | UrlObject
  children?: React.ReactNode
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, href, children }) => (
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
    <Icon as={icon} fontSize="lg" opacity={0.64} />
    <Text fontWeight="medium">
      <Link href={href}> {children} </Link>{' '}
    </Text>
  </HStack>
)

const Dashboard: React.FC = () => {
  return (
    <Flex h="100vh" position="relative">
      <Box
        w="2xs"
        fontSize="sm"
        bg={useColorModeValue('purple.100', 'purple.700')}
        h="100%"
      >
        <Flex direction="column" h="100%">
          <Box px={8} py={6}>
            <HStack spacing={4}>
              <Icon fontSize="4xl" color="teal.500" as={FaLeaf} />
              <Text fontSize="3xl" fontWeight="extrabold">
                Terra
              </Text>
            </HStack>
          </Box>
          <Box flex="1 1 0" pt={4} px={4}>
            <Stack
              divider={<StackDivider borderColor="purple.200" />}
              spacing={6}
            >
              <Stack spacing={4}>
                <MenuItem icon={FaHome} href="/dashboard">
                  Dashboard{' '}
                </MenuItem>
                <MenuItem icon={FaDatabase} href="/inventory">
                  Inventory{' '}
                </MenuItem>
                <MenuItem icon={FaTruck} href="/delivery">
                  Delivery{' '}
                </MenuItem>
                <MenuItem icon={FaShoppingCart} href="/pos">
                  POS{' '}
                </MenuItem>
                <MenuItem icon={FaUserFriends} href="/customers">
                  Customers{' '}
                </MenuItem>
              </Stack>
              <Stack spacing={4}>
                <MenuItem icon={FaBell} href="/notifications">
                  Notifications
                </MenuItem>
                <MenuItem icon={FaCog} href="/settings">
                  Settings{' '}
                </MenuItem>
              </Stack>
            </Stack>
          </Box>
          <Box
            px={8}
            py={4}
            borderTopWidth="1px"
            borderTopColor="purple.200"
            textAlign="center"
          >
            <HStack spacing={4}>
              <Avatar size="sm" />
              <Stack alignItems="baseline" spacing={0}>
                <Text>Joe User</Text>
                <Text fontSize="xs" fontWeight="semibold" letterSpacing="0.5px">
                  joe@acme.com
                </Text>
              </Stack>
            </HStack>
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
