import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { ReactElement } from 'react'
import { Schedule } from '@/components/schedule'
import { AdminLayout } from '@/components/layouts/admin-layout'

const Delivery = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Schedule />
    </DndProvider>
  )
}

export default Delivery

Delivery.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
