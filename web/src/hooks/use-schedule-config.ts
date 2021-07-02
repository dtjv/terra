import axios from 'axios'
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query'

import type { ScheduleData } from '@/types/types'

export type UseScheduleConfigReturnType<T> = {
  scheduleConfigQuery: UseQueryResult<T>
}

export const useScheduleConfig = <T = ScheduleData>(
  url = '/api/schedule',
  options?: UseQueryOptions<T, Error>
): UseScheduleConfigReturnType<T> => {
  const scheduleConfigQuery = useQuery<T, Error>(
    ['schedule-config'],
    async () => (await axios.get(url)).data,
    {
      refetchIntervalInBackground: true,
      refetchInterval: 60 * 5,
      ...options,
    }
  )

  return { scheduleConfigQuery }
}
