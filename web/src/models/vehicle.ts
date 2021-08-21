import { Schema, model, models } from 'mongoose'
import type { Model } from 'mongoose'
import type { Vehicle } from '@/types/types'

const vehicleSchema = new Schema<Vehicle, Model<Vehicle>, Vehicle>({
  vehicleKey: {
    type: String,
    unique: true,
    required: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
})

export const VehicleModel =
  models['Vehicle'] ?? model<Vehicle, Model<Vehicle>>('Vehicle', vehicleSchema)
