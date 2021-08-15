import type { ReactElement } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { NotReadyYet } from '@/components/not-ready'

const Pos = () => <NotReadyYet />

export default Pos

Pos.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
