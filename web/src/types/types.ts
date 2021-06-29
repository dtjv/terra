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
  originalDateTimeISO: string
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

export type UpdatedTicketData = Pick<TicketData, 'id'> & Partial<TicketData>

// ----------------------------------------------------------------------------
//
// ui interfaces
//
// ----------------------------------------------------------------------------

export enum CellKind {
  ROW_HEADER = 'ROW_HEADER',
  COL_HEADER = 'COL_HEADER',
  DATA_CELL = 'DATA_CELL',
}

export interface RowHeader extends TimeData {
  kind: CellKind.ROW_HEADER
  display: string
}

export interface ColHeader extends VehicleData {
  kind: CellKind.COL_HEADER
  display: string
}

export interface DataCell {
  kind: CellKind.DATA_CELL
  ticket: TicketData | undefined
}

export interface Cell {
  rowIdx: number
  colIdx: number
  data: RowHeader | ColHeader | DataCell
}

export interface ScheduleMatrix {
  rowHeaders: RowHeader[]
  colHeaders: ColHeader[]
  cells: Cell[][]
  timeIntervalInMinutes: number
}
