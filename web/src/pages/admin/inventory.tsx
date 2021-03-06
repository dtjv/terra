import type { ReactElement } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { NotReadyYet } from '@/components/not-ready'

const Inventory = () => <NotReadyYet />

export default Inventory

Inventory.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
