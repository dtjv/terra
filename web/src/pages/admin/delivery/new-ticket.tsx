import { getVehicles } from '@/lib/db'
import { toVehicle } from '@/types/utils'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { TicketCreate } from '@/components/ticket/ticket-create'
import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import type { Vehicle, VehicleDocument } from '@/types/types'

interface NewTicketProps {
  vehicles: Vehicle[]
}

export const NewTicket = ({ vehicles }: NewTicketProps) => {
  return <TicketCreate vehicles={vehicles} />
}

export default NewTicket

NewTicket.getLayout = function getLayout(page: ReactElement) {
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
