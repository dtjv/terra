import { Schema, model } from 'mongoose'
import type { Model, Document, LeanDocument } from 'mongoose'

export interface Vehicle {
  key: string
  name: string
}

export interface VehicleDoc extends Vehicle, Document {}

export type VehicleLeanDoc = LeanDocument<VehicleDoc>

const vehicleSchema = new Schema<VehicleDoc, Model<VehicleDoc>, VehicleDoc>({
  key: {
    type: String,
    unique: true,
  },
  name: String,
})

export const VehicleModel = model<VehicleDoc, Model<VehicleDoc>>(
  'Vehicle',
  vehicleSchema
)
