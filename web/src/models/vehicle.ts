import { Schema, model, Model, Document } from 'mongoose'

export interface VehicleProps {
  key: string
  name: string
}

export interface VehicleDoc extends VehicleProps, Document {}

const vehicleSchema = new Schema<VehicleDoc, Model<VehicleDoc>, VehicleDoc>({
  key: {
    type: String,
    unique: true,
  },
  name: String,
})

export const Vehicle = model<VehicleDoc, Model<VehicleDoc>>(
  'Vehicle',
  vehicleSchema
)
