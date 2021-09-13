import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
  Text,
  Icon,
  Box,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react'
import type { UrlObject } from 'url'
import type { ReactNode } from 'react'

interface SidebarMenuItemProps {
  icon: any
  children: ReactNode
}

interface SidebarMenuLinkProps {
  icon: any
  href: string | UrlObject
  children: ReactNode
}

const SidebarMenuItem = ({ icon, children }: SidebarMenuItemProps) => (
  <Box px={3} py={2}>
    <HStack spacing={4}>
      <Icon as={icon} fontSize="xl" opacity={useColorModeValue('0.75', '1')} />
      <Text letterSpacing="wide" fontWeight="medium">
        {children}
      </Text>
    </HStack>
  </Box>
)

export const SidebarMenuLink = ({
  icon,
  href,
  children,
  ...rest
}: SidebarMenuLinkProps) => {
  const { pathname } = useRouter()
  const isActive = pathname.startsWith(href as string)

  if (isActive) {
    return (
      <Box color="white" bg="gray.700" borderRadius="md">
        <SidebarMenuItem icon={icon}>{children}</SidebarMenuItem>
      </Box>
    )
  }

  return (
    <NextLink passHref href={href}>
      <ChakraLink
        cursor="pointer"
        color="gray.700"
        _hover={{
          bg: 'purple.200',
          textDecoration: 'none',
        }}
        _focus={{
          bg: 'purple.200',
        }}
        borderRadius="md"
        transition="background 0.3s ease 0s"
        {...rest}
      >
        <SidebarMenuItem icon={icon}>{children}</SidebarMenuItem>
      </ChakraLink>
    </NextLink>
  )
}
