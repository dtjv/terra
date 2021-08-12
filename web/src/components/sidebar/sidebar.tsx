import {
  Avatar,
  Text,
  Box,
  Flex,
  Stack,
  StackDivider,
  HStack,
  Icon,
  useColorModeValue,
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
import { SidebarMenuItem } from '@/components/sidebar'

export const Sidebar = () => (
  <Box
    w="280px"
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
        <Stack divider={<StackDivider borderColor="purple.200" />} spacing={6}>
          <Stack spacing={4}>
            <SidebarMenuItem icon={FaHome} href="/dashboard">
              Dashboard{' '}
            </SidebarMenuItem>
            <SidebarMenuItem icon={FaDatabase} href="/inventory">
              Inventory{' '}
            </SidebarMenuItem>
            <SidebarMenuItem icon={FaTruck} href="/delivery">
              Delivery{' '}
            </SidebarMenuItem>
            <SidebarMenuItem icon={FaShoppingCart} href="/pos">
              POS{' '}
            </SidebarMenuItem>
            <SidebarMenuItem icon={FaUserFriends} href="/customers">
              Customers{' '}
            </SidebarMenuItem>
          </Stack>
          <Stack spacing={4}>
            <SidebarMenuItem icon={FaBell} href="/notifications">
              Notifications
            </SidebarMenuItem>
            <SidebarMenuItem icon={FaCog} href="/settings">
              Settings{' '}
            </SidebarMenuItem>
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
)
