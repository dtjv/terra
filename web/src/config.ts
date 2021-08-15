export const SCHEDULE_ROW_N_MIN_HEIGHT = 35
export const SCHEDULE_COL_0_WIDTH = 80
export const SCHEDULE_COL_N_MIN_WIDTH = 100

export const TICKETS_QUERY_KEY = 'tickets'
export const TICKETS_API =
  process.env['NEXT_PUBLIC_TICKETS_API'] ?? 'api/tickets'
export const TICKETS_REFRESH_INTERVAL_IN_MS = 1000 * 60

export const VEHICLES_QUERY_KEY = 'vehicles'
export const VEHICLES_API =
  process.env['NEXT_PUBLIC_VEHICLES_API'] ?? 'api/vehicles'

export const SCHEDULE_START_HOUR_IN_24HR = parseInt(
  process.env['NEXT_PUBLIC_SCHEDULE_START_HOUR_IN_24HR'] ?? '8',
  10
)
export const SCHEDULE_END_HOUR_IN_24HR = parseInt(
  process.env['NEXT_PUBLIC_SCHEDULE_END_HOUR_IN_24HR'] ?? '18',
  10
)
export const SCHEDULE_TIME_BLOCK_IN_MINUTES = parseInt(
  process.env['NEXT_PUBLIC_SCHEDULE_TIME_BLOCK_IN_MINUTES'] ?? '30',
  10
)
