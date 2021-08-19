import type {
  Ticket,
  Vehicle,
  TicketDocument,
  VehicleDocument,
} from '@/types/types'

export const toVehicle = (vehicleDoc: VehicleDocument): Vehicle => {
  const { id, key, name } = vehicleDoc
  return { id, key, name }
}

export const toTicket = (ticketDoc: TicketDocument): Ticket => {
  const {
    id,
    ticketKind,
    customerName,
    destinationAddress,
    vehicleKey,
    scheduledAt,
    durationInMinutes,
    vehicleDoc,
    scheduledTimeRange,
    scheduledStartTime,
  } = ticketDoc

  return {
    id,
    ticketKind,
    customerName,
    destinationAddress,
    vehicleKey,
    scheduledAt,
    durationInMinutes,
    vehicleDoc,
    scheduledTimeRange,
    scheduledStartTime,
  }
}
