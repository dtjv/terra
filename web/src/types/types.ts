import type { Document, PopulatedDoc } from 'mongoose'
import { CellKind, TicketKind } from '@/types/enums'

//-----------------------------------------------------------------------------
// Vehicle types
//-----------------------------------------------------------------------------
export interface VehicleInput {
  key: string
  name: string
}

export interface Vehicle extends VehicleInput {
  id: string
}

export interface VehicleDocument extends VehicleInput, Document {}

//-----------------------------------------------------------------------------
// Ticket types
//
// - `durationInMinutes` is computed on the client side. its value depends on
//   `destinationAddress` - `street` and `zip`.
// - `scheduledAtISO` is computed on the client side. its value depends on
//   `vehicleKey` and `durationInMinutes`.
//-----------------------------------------------------------------------------
export interface TicketInput {
  ticketKind: TicketKind
  customerName: string
  destinationAddress: {
    street: string
    zip: string
  }
  vehicleKey: string
  scheduledAtISO: string
  durationInMinutes: number
}

interface TicketExtended extends TicketInput {
  vehicleDoc: PopulatedDoc<VehicleDocument>
  ticketRange: string
  scheduledStartTime: string
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
  scheduleTimeISO: string
  hourFormat: string
  hourMinuteFormat: string
}

export type ColHeader = Vehicle

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
