import axios from 'axios'
import { useQuery } from 'react-query'
import type { UseQueryResult, UseQueryOptions } from 'react-query'

import type { VehicleData } from '@/types/types'

export type UseVehiclesReturnType<T> = {
  vehiclesQuery: UseQueryResult<T>
}

export const useVehicles = <T = VehicleData[]>(
  url = '/api/vehicles',
  options?: UseQueryOptions<T, Error>
): UseVehiclesReturnType<T> => {
  const vehiclesQuery = useQuery<T, Error>(
    ['vehicles'],
    async () => (await axios.get(url)).data,
    {
      refetchIntervalInBackground: true,
      refetchInterval: 60 * 5,
      ...options,
    }
  )

  return { vehiclesQuery }
}
