import type {
  Ticket,
  Vehicle,
  TicketDocument,
  VehicleDocument,
} from '@/types/types'

export const toVehicle = (vehicleDoc: VehicleDocument): Vehicle => {
  const { id, vehicleKey, vehicleName } = vehicleDoc
  return { id, vehicleKey, vehicleName }
}

export const toTicket = (ticketDoc: TicketDocument): Ticket => {
  const {
    id,
    ticketKind,
    customerName,
    destinationAddress,
    vehicleKey,
    scheduledAt,
    scheduledTime,
    durationInMinutes,
    vehicleDoc,
    scheduledTimeRange,
  } = ticketDoc

  return {
    id,
    ticketKind,
    customerName,
    destinationAddress,
    vehicleKey,
    scheduledAt,
    scheduledTime,
    durationInMinutes,
    vehicleDoc,
    scheduledTimeRange,
  }
}
