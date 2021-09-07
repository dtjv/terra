import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { ReactElement } from 'react'
import type { GetServerSideProps } from 'next'
import { Schedule } from '@/components/schedule'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { getVehicles } from '@/lib/db'
import { toVehicle } from '@/types/utils'
import type { Vehicle, VehicleDocument } from '@/types/types'

interface DeliveryProps {
  vehicles: Vehicle[]
}
const Delivery = ({ vehicles }: DeliveryProps) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Schedule vehicles={vehicles} />
    </DndProvider>
  )
}

export default Delivery

Delivery.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export const getServerSideProps: GetServerSideProps = async () => {
  const vehicleDocs: VehicleDocument[] = await getVehicles()
  const vehicles: Vehicle[] = vehicleDocs.map((vehicleDoc) =>
    toVehicle(vehicleDoc)
  )

  return {
    props: {
      vehicles,
    },
  }
}
