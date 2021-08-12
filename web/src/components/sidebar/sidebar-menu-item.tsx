import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Text, Icon, HStack, Link as ChakraLink } from '@chakra-ui/react'
import type { UrlObject } from 'url'
import type { ReactNode } from 'react'

interface SidebarMenuItemProps {
  icon: any
  href: string | UrlObject
  children: ReactNode
}

export const SidebarMenuItem = ({
  icon,
  href,
  children,
  ...rest
}: SidebarMenuItemProps) => {
  const { pathname } = useRouter()
  const isActive = pathname === href
  return (
    <NextLink passHref href={href}>
      <ChakraLink
        spacing={4}
        cursor="pointer"
        px={3}
        py={2}
        borderRadius="md"
        bg={isActive ? 'gray.700' : 'inherit'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: 'gray.700',
          color: 'white',
          textDecoration: 'none',
        }}
        _focus={{
          bg: 'gray.700',
          color: 'white',
        }}
        transition="all 0.3s ease 0s"
        {...rest}
      >
        <HStack>
          <Icon as={icon} fontSize="lg" opacity={0.64} />
          <Text fontWeight="medium">{children}</Text>
        </HStack>
      </ChakraLink>
    </NextLink>
  )
}
