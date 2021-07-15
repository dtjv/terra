import { Schema, model, Model } from 'mongoose'

export interface VehicleProps {
  key: string
  name: string
}

const vehicleSchema = new Schema<
  VehicleProps,
  Model<VehicleProps>,
  VehicleProps
>({
  key: {
    type: String,
    unique: true,
  },
  name: String,
})

export const Vehicle = model<VehicleProps, Model<VehicleProps>>(
  'Vehicle',
  vehicleSchema
)
