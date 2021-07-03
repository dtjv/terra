import axios from 'axios'
import { useQuery, UseQueryResult } from 'react-query'
import type { VehicleData } from '@/types/types'

const VEHICLES_QUERY_KEY = 'vehicles'
const VEHICLES_API = process.env['NEXT_PUBLIC_VEHICLES_API'] ?? ''

type UseVehiclesReturnType<T> = {
  vehiclesQuery: UseQueryResult<T>
}

export const useVehicles = <T = VehicleData[]>(): UseVehiclesReturnType<T> => {
  const vehiclesQuery = useQuery<T, Error>(
    [VEHICLES_QUERY_KEY],
    async () => {
      if (VEHICLES_API === '') {
        throw new Error('No vehicle API defined')
      }
      const { data } = await axios.get(VEHICLES_API)
      return data
    },
    { refetchInterval: false }
  )

  return { vehiclesQuery }
}
