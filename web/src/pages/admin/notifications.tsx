import type { ReactElement } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { NotReadyYet } from '@/components/not-ready'

const Notifications = () => <NotReadyYet />

export default Notifications

Notifications.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
