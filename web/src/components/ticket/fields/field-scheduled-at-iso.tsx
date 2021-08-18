import { useCallback, useEffect, useState } from 'react'
import { useWatch, Controller } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import type { Vehicle, TicketInput } from '@/types/types'

// TODO: remove
interface TimesData {
  id: number
  dateISO: string
}

// TODO: remove
const wait = (ms: number) => new Promise((success) => setTimeout(success, ms))

// TODO: remove
const rand = (min = 3, max = 6): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// TODO: remove
const getTimesAPI = async (): Promise<TimesData[]> => {
  console.log(`retrieving times...`)
  await wait(2000)
  return Array(rand())
    .fill({})
    .map((_, i) => ({
      id: i + 1,
      dateISO: `2021-09-05T0${i + 1}:00:00.000Z`,
    }))
}

const getVehiclesAPI = async (): Promise<Vehicle[]> => {
  console.log(`retrieving vehicles...`)
  await wait(2000)
  return [
    { id: 'A', key: '102', name: 'Truck 102' },
    { id: 'B', key: '202', name: 'Truck 202' },
    { id: 'C', key: '302', name: 'Truck 302' },
  ]
}

export const ScheduleAtISO = ({
  control,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const vehicleKey = useWatch({ control, name: 'vehicleKey' })
  const [timeChoices, setTimeChoices] = useState<TimesData[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  // TODO: this cannot be necessary! a vehicleKey being watched is coming from
  // the form and that field must be a set of selected, valid values.
  const isValidVehicleKey = useCallback(
    (key: string) => !!vehicles.find((data) => data.key === key),
    [vehicles]
  )

  useEffect(() => {
    ;(async () => {
      const vehicleData = await getVehiclesAPI()
      setVehicles(vehicleData)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (
        !errors.durationInMinutes &&
        !errors.vehicleKey &&
        isValidVehicleKey(vehicleKey)
      ) {
        const choices = await getTimesAPI()
        console.log(`-> time choices:`, choices)
        setTimeChoices(choices)
      }
    })()
  }, [
    durationInMinutes,
    vehicleKey,
    errors.durationInMinutes,
    errors.vehicleKey,
    isValidVehicleKey,
  ])

  return (
    <>
      {timeChoices.length > 0 ? (
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Pick a time:</FormLabel>
          <Controller
            name="scheduledAtISO"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <RadioGroup
                name="scheduledAtISO"
                onChange={onChange}
                value={value}
                ref={ref}
              >
                <Stack>
                  {timeChoices.map(({ id, dateISO }) => {
                    return (
                      <Radio key={id} value={dateISO}>
                        {new Date(dateISO).toLocaleString()}
                      </Radio>
                    )
                  })}
                </Stack>
              </RadioGroup>
            )}
          />
        </FormControl>
      ) : null}
    </>
  )
}
