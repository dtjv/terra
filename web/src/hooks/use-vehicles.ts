import axios from 'axios'
import { useQuery } from 'react-query'

import type { VehicleData } from '@/types/types'

export const useVehicles = (url = '/api/vehicles') => {
  const vehiclesQuery = useQuery<VehicleData[], Error>(
    ['vehicles'],
    async () => (await axios.get(url)).data,
    {}
  )

  return { vehiclesQuery }
}
