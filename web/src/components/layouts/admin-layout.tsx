import type { ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'
import { Sidebar } from '@/components/sidebar'

interface LayoutProps {
  children: ReactNode
}

export const AdminLayout = ({ children }: LayoutProps) => (
  <Flex h="100vh" position="relative">
    <Sidebar />
    <Flex flex="1 1 0" align="center" justifyContent="center">
      {children}
    </Flex>
  </Flex>
)
