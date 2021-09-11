import mongoose from 'mongoose'
import minimist from 'minimist'
import { connectToDB } from '@/lib/db'
import { VehicleModel } from '@/models/vehicle'
import type { VehicleInput } from '@/types/types'

const defaultVehicles = [
  { vehicleKey: '102', vehicleName: 'Truck 102' },
  { vehicleKey: '202', vehicleName: 'Truck 202' },
  { vehicleKey: '302', vehicleName: 'Truck 302' },
]
const usage = `
  Usage: load-vehicles [options]

  Options:
    --key=<key>   vehicle key
    --drop        drop vehicles & tickets collections (default=false)
`
const main = async (): Promise<void> => {
  const args = minimist(process.argv.slice(2))
  const help = Boolean(args?.['h']) || Boolean(args?.['help'])

  if (help) {
    console.log(usage)
    process.exit(0)
  }

  const vKey = args?.['key']
  const drop = Boolean(args?.['drop']) ?? false
  const vehicles = drop ? [...defaultVehicles] : []

  if (vKey) {
    vehicles.push({
      vehicleKey: vKey,
      vehicleName: `Truck ${vKey}`,
    })
  }

  if (vehicles.length > 0) {
    if (!(await connectToDB())) {
      console.error(`An error occurred connecting to database.`)
      process.exit(1)
    }

    if (drop) {
      try {
        await mongoose.connection.db.dropCollection('vehicles')
        await mongoose.connection.db.dropCollection('tickets')
        console.log('Collections dropped. You need to re-load tickets.')
      } catch (error: any) {
        // MongoDB code for 'NamespaceNotFound'
        if (error?.code !== 26) {
          console.error('An error occurred dropping collections')
          throw error
        }
      }
    }

    try {
      await VehicleModel.create(vehicles as VehicleInput[])
      console.log('Vehicles created successfully.')
    } catch (error) {
      console.error('An error occurred creating vehicle records')
      throw error
    }
  }

  process.exit(0)
}

main()
