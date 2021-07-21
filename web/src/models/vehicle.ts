import { Schema, model } from 'mongoose'
import type { Model } from 'mongoose'
import type { Vehicle } from '@/types/types'

const vehicleSchema = new Schema<Vehicle, Model<Vehicle>, Vehicle>({
  key: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

export const VehicleModel = model<Vehicle, Model<Vehicle>>(
  'Vehicle',
  vehicleSchema
)
