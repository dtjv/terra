import NextLink from 'next/link'
import { Link as ChakraLink } from '@chakra-ui/react'
import type { UrlObject } from 'url'
import type { ReactNode } from 'react'

interface SidebarLinkProps {
  href: string | UrlObject
  children: ReactNode
}

export const SidebarLink = ({ children, href, ...rest }: SidebarLinkProps) => {
  return (
    <NextLink passHref href={href}>
      <ChakraLink _hover={{ textDecoration: 'none' }} {...rest}>
        {children}
      </ChakraLink>
    </NextLink>
  )
}
