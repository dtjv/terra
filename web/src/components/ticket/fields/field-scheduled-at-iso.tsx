import axios from 'axios'
import { useEffect, useState } from 'react'
import { useWatch, Controller } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import type { TicketInput } from '@/types/types'

// TODO: remove
interface TimesData {
  id: number
  dateISO: string
}

// TODO: use a hook or something else?
const useTime = () => {
  const axiosSource = axios.CancelToken.source()
  const getTimesAPI = async () => {
    console.log(`retrieving times...`)
    return (
      await axios.get('/api/demo/times', {
        cancelToken: axiosSource.token,
      })
    ).data
  }
  getTimesAPI.cancel = () => axiosSource.cancel()
  getTimesAPI.isCanceled = (error: any) => axios.isCancel(error)
  return { getTimesAPI }
}

export const ScheduleAtISO = ({
  control,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const vehicleKey = useWatch({ control, name: 'vehicleKey' })
  const [timeChoices, setTimeChoices] = useState<TimesData[]>([])
  const { getTimesAPI } = useTime()

  const isVehicleKeyValid = (vehicleKey: string) =>
    ['102', '202', '302'].includes(vehicleKey)

  useEffect(() => {
    ;(async () => {
      if (
        !errors.durationInMinutes &&
        !errors.vehicleKey &&
        isVehicleKeyValid(vehicleKey)
      ) {
        try {
          const choices: TimesData[] = await getTimesAPI()
          setTimeChoices(choices)
        } catch (error) {
          if (getTimesAPI.isCanceled(error)) {
            console.log(`getTimesAPI is cancelled`)
          } else throw error
        }
      }
    })()
    return () => getTimesAPI.cancel()
  }, [
    durationInMinutes,
    vehicleKey,
    errors.durationInMinutes,
    errors.vehicleKey,
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
