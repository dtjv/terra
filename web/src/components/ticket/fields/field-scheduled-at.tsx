import axios from 'axios'
import { format } from 'date-fns'
import { useEffect, useState, useCallback } from 'react'
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
import type { TicketInput } from '@/types/types'

// TODO: remove?
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
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const vehicleKey = useWatch({ control, name: 'vehicleKey' })
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])

  useEffect(() => {
    const axiosSource = axios.CancelToken.source()

    ;(async () => {
      if (
        vehicleKey &&
        durationInMinutes &&
        !errors.vehicleKey &&
        !errors.durationInMinutes
      ) {
        console.log(`retrieving times...`)

        try {
          const { data } = await axios.post('/api/demo/times', {
            cancelToken: axiosSource.token,
          })
          setAvailableSlots(data as AvailableSlot[])
        } catch (error) {
          if (axios.isCancel(error)) {
            throw error
          }
        }
      }
    })()
    return () => axiosSource.cancel()
  }, [
    durationInMinutes,
    vehicleKey,
    errors.durationInMinutes,
    errors.vehicleKey,
  ])

  // TODO:
  //
  // 1. custom 'onChange' will call 'setValue' to update form state.
  // 3. 'scheduledAt' is hooked up to DateSchema and coerced into a Date. may
  //    need to change if the value of option is gonna be some special format.
  //
  // TODO: ugh!!!
  // availableSlots should be display by time -> by truck
  //   Fri, 8.21 at 8am
  //     truck 102
  //     truck 202
  //   Fri, 8.21 at 9am
  //     truck 102
  //   Sat, 8.22 at 9am
  //     truck 102
  //     truck 202
  //     truck 302
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
                  const { scheduledTime } = JSON.parse(value)
                  setValue('scheduledTime', scheduledTime)
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
                          value={JSON.stringify({ scheduledAt, scheduledTime })}
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
