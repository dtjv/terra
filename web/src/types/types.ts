// ----------------------------------------------------------------------------
//
// data interfaces
//
// ----------------------------------------------------------------------------

export interface ScheduleData {
  scheduleStartTime: number
  scheduleEndTime: number
  timeIntervalInMinutes: number
}

export interface VehicleData {
  id: string
  vehicleName: string
}

export interface TimeData {
  id: string
  time: string
}

export interface TicketData {
  id: string
  scheduledDateTimeISO: string
  vehicleId: string
  durationInMinutes: number
  timeRange?: string
  scheduledStartTime?: string
}

export interface AppData {
  schedule: ScheduleData
  tickets: TicketData[]
  vehicles: VehicleData[]
}

// ----------------------------------------------------------------------------
//
// ui interfaces
//
// ----------------------------------------------------------------------------

export interface RowHeader {
  display: string
  data: TimeData
}

export interface ColHeader {
  display: string
  data: VehicleData | undefined
}

export interface Cell {
  rowIdx: number
  colIdx: number
  data: TicketData | undefined
}

export interface ScheduleMatrix {
  rowHeaders: RowHeader[]
  colHeaders: ColHeader[]
  cells: Cell[][]
  timeIntervalInMinutes: number
}
