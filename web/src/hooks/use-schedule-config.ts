import axios from 'axios'
import { useQuery, UseQueryResult } from 'react-query'
import type { ScheduleData } from '@/types/types'

const SCHEDULE_QUERY_KEY = 'schedule'
const SCHEDULE_API = process.env['NEXT_PUBLIC_SCHEDULE_API'] ?? ''

type UseScheduleConfigReturnType<T> = {
  scheduleConfigQuery: UseQueryResult<T>
}

export const useScheduleConfig = <
  T = ScheduleData
>(): UseScheduleConfigReturnType<T> => {
  const scheduleConfigQuery = useQuery<T, Error>(
    [SCHEDULE_QUERY_KEY],
    async () => {
      if (SCHEDULE_API === '') {
        throw new Error('No schedule API defined')
      }
      const { data } = await axios.get(SCHEDULE_API)
      return data
    },
    { refetchInterval: false }
  )

  return { scheduleConfigQuery }
}
