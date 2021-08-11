import mongoose from 'mongoose'
import { connectToDB } from '@/lib/db'
import { VehicleModel } from '@/models/vehicle'
import { vehicles } from '@/data/vehicles'
import type { VehicleInput } from '@/types/types'

export const createVehicles = async (): Promise<void> => {
  if (!(await connectToDB())) {
    console.error(`failed to connect to db`)
    process.exit(1)
  }

  try {
    await mongoose.connection.db.dropCollection('vehicles')
  } catch (error) {
    console.error(`failed to drop collection.`, error)
    process.exit(1)
  }

  await VehicleModel.create<VehicleInput[]>(vehicles)

  process.exit(0)
}

createVehicles()
