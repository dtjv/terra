import { Flex, Heading } from '@chakra-ui/react'
import type { ReactElement } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'

const Inventory = () => (
  <Flex alignItems="center" justifyContent="center">
    <Heading>Inventory</Heading>
  </Flex>
)

export default Inventory

Inventory.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
