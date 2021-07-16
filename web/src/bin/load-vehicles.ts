import mongoose from 'mongoose'

import { Vehicle, VehicleProps } from '@/models/vehicle'
import { vehicles } from '@/data/vehicles'
import { connectToDB } from '@/lib/mongo-db'

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

  await Vehicle.create<VehicleProps[]>(vehicles)

  process.exit(0)
}

createVehicles()
