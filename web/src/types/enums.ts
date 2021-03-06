export enum CellKind {
  DATA_CELL = 'DATA_CELL',
  ROW_HEADER = 'ROW_HEADER',
  COL_HEADER = 'COL_HEADER',
}

export enum DragItem {
  TICKET = 'TICKET',
}

export enum TicketKind {
  PICKUP = 'Pickup',
  DELIVERY = 'Delivery',
  STOP = 'Stop',
  FUEL = 'Fuel',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
