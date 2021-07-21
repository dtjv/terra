import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getVehicles } from '@/lib/db'
import { toVehicle } from '@/types/utils'
import type { Vehicle, VehicleDocument } from '@/types/types'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/vehicles`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    const vehicleDocs: VehicleDocument[] = await getVehicles()
    const vehicles: Vehicle[] = vehicleDocs.map((vehicleDoc) =>
      toVehicle(vehicleDoc)
    )
    return res.status(200).json(vehicles)
  }

  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
