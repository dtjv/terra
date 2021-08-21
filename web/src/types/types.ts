import type { Document, PopulatedDoc } from 'mongoose'
import { CellKind, TicketKind } from '@/types/enums'

//-----------------------------------------------------------------------------
// Vehicle types
//-----------------------------------------------------------------------------
export interface VehicleInput {
  vehicleKey: string
  vehicleName: string
}

export interface Vehicle extends VehicleInput {
  id: string
}

export interface VehicleDocument extends VehicleInput, Document {}

//-----------------------------------------------------------------------------
// Ticket types
//-----------------------------------------------------------------------------
export interface TicketInput {
  ticketKind: TicketKind
  customerName: string
  destinationAddress: {
    street: string
    zip: string
  }
  vehicleKey: string
  scheduledAt: Date
  scheduledTime: string
  durationInMinutes: number
}

interface TicketExtended extends TicketInput {
  vehicleDoc: PopulatedDoc<VehicleDocument>
  scheduledTimeRange: string
}

export interface Ticket extends TicketExtended {
  id: string
}

export interface TicketDocument extends TicketExtended, Document {}

export type UpdatedTicket = Pick<Ticket, 'id'> & Partial<Ticket>

export type TicketContext = { previousTickets: Ticket[] }

//-----------------------------------------------------------------------------
// UI schedule types
//-----------------------------------------------------------------------------
export type RowHeader = {
  time: string
  timeHour: string
  timeHourMinute: string
}

export type ColHeader = {
  vehicleKey: string
  vehicleName: string
}

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
  ticket: Ticket | undefined
  rowHeader: RowHeader
  colHeader: ColHeader
}

export type Cell = { key: string } & (RowHeaderCell | ColHeaderCell | DataCell)

export interface Row {
  key: string
  cells: Cell[]
}
