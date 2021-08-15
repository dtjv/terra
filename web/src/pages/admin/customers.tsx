import type { ReactElement } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { NotReadyYet } from '@/components/not-ready'

const Customers = () => <NotReadyYet />

export default Customers

Customers.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
