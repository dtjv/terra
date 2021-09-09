import type { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from '@/components/sidebar'

interface LayoutProps {
  children: ReactNode
}

export const AdminLayout = ({ children }: LayoutProps) => (
  <Flex h="100vh" position="relative">
    <Sidebar />
    <Box flex="1 1 0" minW="680px">
      {children}
    </Box>
  </Flex>
)
