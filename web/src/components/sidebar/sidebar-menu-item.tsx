import { useRouter } from 'next/router'
import { Text, Icon, HStack } from '@chakra-ui/react'
import type { UrlObject } from 'url'
import type { ReactNode } from 'react'
import { SidebarLink } from '@/components/sidebar/sidebar-link'

export interface SidebarMenuItemProps {
  icon: any
  href: string | UrlObject
  children?: ReactNode
}

export const SidebarMenuItem = ({
  icon,
  href,
  children,
}: SidebarMenuItemProps) => {
  const { pathname } = useRouter()
  const isActive = pathname === href

  return (
    <SidebarLink href={href}>
      <HStack
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
        }}
        transition="all 0.3s ease 0s"
      >
        <Icon as={icon} fontSize="lg" opacity={0.64} />
        <Text fontWeight="medium">{children}</Text>
      </HStack>
    </SidebarLink>
  )
}
