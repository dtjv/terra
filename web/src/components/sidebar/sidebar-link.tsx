import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Link as ChakraLink } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { UrlObject } from 'url'

interface SidebarLinkProps {
  href: string | UrlObject
  children: ReactNode
}

export const SidebarLink = ({ children, href, ...rest }: SidebarLinkProps) => {
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
