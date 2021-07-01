import axios from 'axios'
import { useQuery } from 'react-query'

import type { ScheduleData } from '@/types/types'

export const useScheduleConfig = (url = '/api/vehicles') => {
  const scheduleConfigQuery = useQuery<ScheduleData[], Error>(
    ['schedule-config'],
    async () => (await axios.get(url)).data,
    {}
  )

  return { scheduleConfigQuery }
}
