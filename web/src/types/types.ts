import { TicketLeanDoc } from '@/models/ticket'
import { VehicleLeanDoc } from '@/models/vehicle'
import { CellKind, TicketStatus } from '@/constants/constants'

// TODO: remove start
import { Infer } from 'superstruct'
import { TicketFormSchema } from '@/schemas/schemas'

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

export type TicketContext = { previousTickets: TicketData[] }
// TODO: remove end

export type RowHeader = {
  scheduleTimeISO: string
  hourFormat: string
  hourMinuteFormat: string
}

export type ColHeader = VehicleLeanDoc

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
  ticket: TicketLeanDoc | undefined
  rowHeader: RowHeader
  colHeader: ColHeader
}

export type Cell = { key: string } & (RowHeaderCell | ColHeaderCell | DataCell)

export interface Row {
  key: string
  cells: Cell[]
}
