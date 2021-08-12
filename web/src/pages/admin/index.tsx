import type { ReactElement } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { ToggleColorMode } from '@/components/toggle-color-mode'

const Admin = () => {
  return <ToggleColorMode />
}

export default Admin

Admin.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
