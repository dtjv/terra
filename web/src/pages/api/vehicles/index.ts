import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getVehicles } from '@/lib/db'

//------------------------------------------------------------------------------
// Handler for api calls to `/api/vehicles`
//------------------------------------------------------------------------------
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    const vehicles = await getVehicles()
    return res.status(200).json(vehicles)
  }

  return res.status(404).send(`Unsupported method: ${req.method}`)
}

export default handler
