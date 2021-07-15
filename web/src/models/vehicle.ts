import { Schema, model, Model, Document } from 'mongoose'

export interface VehicleProps {
  name: string
}

interface VehicleDoc extends VehicleProps, Document {}

const vehicleSchema = new Schema<VehicleDoc, Model<VehicleDoc>, VehicleDoc>({
  name: String,
})

export const Vehicle = model<VehicleDoc, Model<VehicleDoc>>(
  'Vehicle',
  vehicleSchema
)
