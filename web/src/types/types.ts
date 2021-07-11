import { Infer } from 'superstruct'
import { CellKind, TicketStatus } from '@/constants/constants'
import { TicketFormSchema } from '@/schemas/schemas'

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

export type TicketFormInputs = Infer<typeof TicketFormSchema>

export type TicketComputedFields = {
  // computed & stored.
  id: string
  status?: TicketStatus
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string[]
  // computed. NOT stored
  timeRange?: string
  scheduledStartTime?: string
}

// TicketData is read from DB.
export type TicketData = TicketComputedFields & TicketFormInputs

export type UpdatedTicketData = Pick<TicketData, 'id'> & Partial<TicketData>

// TODO: specific to react-dnd? rename?
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
