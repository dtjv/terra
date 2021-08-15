import type { ReactElement } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { NotReadyYet } from '@/components/not-ready'

const Admin = () => <NotReadyYet />

export default Admin

Admin.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
