import axios from 'axios'
import { useQuery } from 'react-query'
import { VEHICLES_QUERY_KEY, VEHICLES_API } from '@/config'
import type { Vehicle } from '@/types/types'

export const useVehicles = <T = Vehicle[]>() => {
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
