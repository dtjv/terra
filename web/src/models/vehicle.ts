import { Schema, model } from 'mongoose'
import type { Model, Document } from 'mongoose'

export interface Vehicle {
  key: string
  name: string
}

export interface VehicleDocument extends Vehicle, Document {}

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
