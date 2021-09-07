import { createContext } from 'react'
import type { Vehicle } from '@/types/types'

interface VehicleContext {
  vehicles: Vehicle[]
}

export const VehicleContext = createContext<VehicleContext>({ vehicles: [] })
