import {
  generateGrid,
  generateTimeRange,
  generateTimeList,
  generateDataCells,
} from './utils'

//-----------------------------------------------------------------------------
//
// Sourced from DB
//
//-----------------------------------------------------------------------------
const startTime = 8
const endTime = 18
const intervalInMinutes = 30

const trucks = [
  { id: '102', display: 'Truck 102' },
  { id: '202', display: 'Truck 202' },
  { id: '302', display: 'Truck 302' },
]

const tickets = [
  { id: 'A', type: 'Pickup', time: '8:00 AM', truckId: '102', duration: 30 },
  { id: 'B', type: 'Delivery', time: '8:30 AM', truckId: '102', duration: 30 },
  { id: 'C', type: 'Delivery', time: '10:00 AM', truckId: '102', duration: 60 },
  { id: 'D', type: 'Delivery', time: '8:00 AM', truckId: '202', duration: 90 },
  { id: 'E', type: 'Delivery', time: '11:00 AM', truckId: '202', duration: 30 },
  { id: 'F', type: 'Delivery', time: '11:30 AM', truckId: '202', duration: 30 },
  { id: 'G', type: 'Delivery', time: '8:00 AM', truckId: '302', duration: 60 },
]

//-----------------------------------------------------------------------------
//
// Computed values
//
//-----------------------------------------------------------------------------
const range = generateTimeRange({ startTime, endTime, intervalInMinutes })
const times = generateTimeList(range)
const data = generateDataCells(times, trucks, tickets)

export const grid = {
  rowHeaders: times,
  colHeaders: trucks,
  data,
  grid: generateGrid({
    data,
    rowHeaders: times,
    colHeaders: [{ id: '', display: '' }, ...trucks],
  }),
  intervalInMinutes,
}
