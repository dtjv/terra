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
import { SidebarMenuLink } from '@/components/sidebar'

export const Sidebar = () => (
  <Box
    minW="280px"
    fontSize="sm"
    bg={useColorModeValue('purple.100', 'purple.700')}
    h="100%"
  >
    <Flex direction="column" h="100%">
      <Box px={8} py={6}>
        <HStack spacing={4}>
          <Icon
            fontSize="4xl"
            color={useColorModeValue('teal.500', 'teal.200')}
            as={FaLeaf}
          />
          <Text fontSize="3xl" fontWeight="black">
            Terra
          </Text>
        </HStack>
      </Box>
      <Box flex="1 1 0" pt={4} px={4}>
        <Stack divider={<StackDivider borderColor="purple.200" />} spacing={6}>
          <Stack spacing={2}>
            <SidebarMenuLink icon={FaHome} href="/admin">
              Dashboard
            </SidebarMenuLink>
            <SidebarMenuLink icon={FaDatabase} href="/admin/inventory">
              Inventory
            </SidebarMenuLink>
            <SidebarMenuLink icon={FaTruck} href="/admin/delivery">
              Delivery
            </SidebarMenuLink>
            <SidebarMenuLink icon={FaShoppingCart} href="/admin/pos">
              POS
            </SidebarMenuLink>
            <SidebarMenuLink icon={FaUserFriends} href="/admin/customers">
              Customers
            </SidebarMenuLink>
          </Stack>
          <Stack spacing={2}>
            <SidebarMenuLink icon={FaBell} href="/admin/notifications">
              Notifications
            </SidebarMenuLink>
            <SidebarMenuLink icon={FaCog} href="/admin/settings">
              Settings
            </SidebarMenuLink>
          </Stack>
        </Stack>
      </Box>
      <Box px={8} py={4} textAlign="center">
        <HStack spacing={4}>
          <Avatar size="sm" />
          <Stack alignItems="baseline" spacing={0}>
            <Text>Joe User</Text>
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wide">
              joe@acme.com
            </Text>
          </Stack>
        </HStack>
      </Box>
    </Flex>
  </Box>
)
