import mongoose from 'mongoose'
import minimist from 'minimist'
import { connectToDB } from '@/lib/db'
import { VehicleModel } from '@/models/vehicle'
import type { RC, VehicleInput } from '@/types/types'

const defaultVehicles = [
  { vehicleKey: '102', vehicleName: 'Truck 102' },
  { vehicleKey: '202', vehicleName: 'Truck 202' },
  { vehicleKey: '302', vehicleName: 'Truck 302' },
]

export const loadVehicles = async (args: minimist.ParsedArgs): Promise<RC> => {
  const vKey = args?.['key']
  const drop = Boolean(args?.['drop']) ?? false
  const vehicles = drop ? [...defaultVehicles] : []

  if (vKey) {
    vehicles.push({
      vehicleKey: vKey,
      vehicleName: `Truck ${vKey}`,
    })
  }

  if (vehicles.length > 0) {
    if (!(await connectToDB())) {
      return { message: `Failed to connect to database`, success: false }
    }

    if (drop) {
      try {
        await mongoose.connection.db.dropCollection('vehicles')
        console.log('Collection dropped. You need to re-load tickets.')
      } catch (error: any) {
        // MongoDB code for 'NamespaceNotFound'
        if (error?.code !== 26) {
          return {
            error,
            message: 'Failed to drop collections',
            success: false,
          }
        }
      }
    }

    try {
      await VehicleModel.create(vehicles as VehicleInput[])
    } catch (error: any) {
      return { error, message: 'Failed to create collection', success: false }
    }
  }

  return {
    error: undefined,
    message: 'Vehicles created successfully',
    success: true,
  }
}
