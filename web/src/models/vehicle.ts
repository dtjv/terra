import { Schema, model } from 'mongoose'
import type { Model } from 'mongoose'

export interface Vehicle {
  key: string
  name: string
}

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
