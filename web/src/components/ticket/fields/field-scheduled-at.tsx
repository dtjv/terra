import axios from 'axios'
import { set, format } from 'date-fns'
import { useEffect, useState, useContext } from 'react'
import { useWatch, Controller } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  Stack,
  Text,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import type { UseFormReturn } from 'react-hook-form'
import { ScheduleContext } from '@/hooks/use-schedule'
import type { TicketInput } from '@/types/types'

// TODO: move to types?
interface AvailableSlot {
  key: number
  vehicleKey: string
  scheduledAt: string
  scheduledTime: string
  scheduledAtFull: string
}

export const ScheduleAt = ({
  control,
  setValue,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const { vehicles } = useContext(ScheduleContext)
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])

  useEffect(() => {
    const axiosSource = axios.CancelToken.source()

    ;(async () => {
      if (durationInMinutes && !errors.durationInMinutes) {
        // TODO: remove Date param
        const today = new Date('2021-08-19T15:23:00.000Z')
        const currentDate = set(today, {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })
        const currentTime = format(today, 'HH:mm:ss.SSS')

        // TODO: add a requestDate to ui and form
        try {
          const { data } = await axios.post(
            '/api/schedule',
            {
              vehicleKeys: vehicles.map((v) => v.vehicleKey),
              currentDate,
              currentTime,
              //requestDate: new Date('2021-8-20'), // optional
              requestDate: undefined,
              durationInMinutes: 30,
            },
            {
              cancelToken: axiosSource.token,
            }
          )
          setAvailableSlots(data as AvailableSlot[])
        } catch (error) {
          if (axios.isCancel(error)) {
            throw error
          }
        }
      }
    })()
    return () => axiosSource.cancel()
  }, [durationInMinutes, errors.durationInMinutes])

  // TODO: improve UI
  return (
    <>
      {availableSlots.length > 0 ? (
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Pick a time:</FormLabel>
          <Controller
            name="scheduledAt"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <RadioGroup
                name="scheduledAt"
                onChange={(value) => {
                  onChange(value)
                  const { scheduledTime, vehicleKey } = JSON.parse(value)
                  setValue('scheduledTime', scheduledTime)
                  setValue('vehicleKey', vehicleKey)
                }}
                value={value ? value.toString() : ''}
                ref={ref}
              >
                <Stack>
                  {availableSlots.map(
                    ({
                      key,
                      vehicleKey,
                      scheduledAt,
                      scheduledTime,
                      scheduledAtFull,
                    }) => {
                      return (
                        <Radio
                          key={key}
                          value={JSON.stringify({
                            vehicleKey,
                            scheduledAt,
                            scheduledTime,
                          })}
                        >
                          {format(new Date(scheduledAtFull), 'PPPPpp')}
                          <Text as="span" fontWeight="bold">
                            {' '}
                            ({vehicleKey}){' '}
                          </Text>
                        </Radio>
                      )
                    }
                  )}
                </Stack>
              </RadioGroup>
            )}
          />
        </FormControl>
      ) : null}
    </>
  )
}
