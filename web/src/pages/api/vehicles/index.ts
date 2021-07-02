import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import type { VehicleData } from '@/types/types'
import { readData } from '@/lib/db'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/vehicles`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<VehicleData[] | string>
) => {
  if (req.method === 'GET') {
    const vehicleData = await readData<VehicleData[]>('src/data/vehicles.json')

    if (!vehicleData) {
      return res.status(500).send('Failed to read vehicle data')
    }

    return res.status(200).json(vehicleData)
  }
}

export default handler
