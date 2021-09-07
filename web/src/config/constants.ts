export const TICKETS_QUERY_KEY = 'tickets'
export const TICKETS_API =
  process.env['NEXT_PUBLIC_TICKETS_API'] ?? '/api/tickets'
export const TICKETS_REFRESH_INTERVAL_IN_MS = 1000 * 60

// TODO: add /api/schedule

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

if (SCHEDULE_END_HOUR_IN_24HR < SCHEDULE_START_HOUR_IN_24HR) {
  throw new Error('Invalid schedule start/end. Start must precede end.')
}

if (![15, 30, 60].includes(SCHEDULE_TIME_BLOCK_IN_MINUTES)) {
  throw new Error('Invalid time block. Valid settings: 15, 30 or 60')
}
