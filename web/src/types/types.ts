import { CellKind } from '@/constants/constants'

export interface ScheduleData {
  id: string
  startHour: number
  endHour: number
  timeBlockInMinutes: number
}

export interface VehicleData {
  id: string
  vehicleId: string
  vehicleName: string
}

export interface TimeData {
  scheduleTimeISO: string
  hourFormat: string
  hourMinuteFormat: string
}

export interface TicketData {
  id: string
  scheduledDateTimeISO: string
  vehicleId: string
  durationInMinutes: number
  timeRange?: string
  scheduledStartTime?: string
}

export type UpdatedTicketData = Pick<TicketData, 'id'> & Partial<TicketData>

export type TicketContext = { previousTickets: TicketData[] }

export type RowHeader = TimeData

export type ColHeader = VehicleData

interface BaseCell<Kind extends CellKind> {
  kind: Kind
  rowIdx: number
  colIdx: number
}

export interface RowHeaderCell
  extends BaseCell<CellKind.ROW_HEADER>,
    RowHeader {
  display: string
}

export interface ColHeaderCell
  extends BaseCell<CellKind.COL_HEADER>,
    ColHeader {
  display: string
}

export interface DataCell extends BaseCell<CellKind.DATA_CELL> {
  ticket: TicketData | undefined
  rowHeader: RowHeader
  colHeader: ColHeader
}

export type Cell = { key: string } & (RowHeaderCell | ColHeaderCell | DataCell)

export interface Row {
  key: string
  cells: Cell[]
}
