export const MIN_COL_WIDTH = 100
export const MIN_ROW_HEIGHT = 60

export enum CellKind {
  DATA_CELL = 'DATA_CELL',
  ROW_HEADER = 'ROW_HEADER',
  COL_HEADER = 'COL_HEADER',
}

export enum DragItem {
  TICKET = 'TICKET',
}

export enum TicketKind {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
