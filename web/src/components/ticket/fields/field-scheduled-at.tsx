import axios from 'axios'
import { set, format } from 'date-fns'
import { useEffect, useState } from 'react'
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

        // const currentDate = new Date()
        // TODO: seed Date() that allows retrieval of 8/19 tickets. remove!
        const today = new Date('2021-08-19T15:23:00.000Z')
        const currentDate = set(today, {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })
        const currentTime = format(today, 'kk:mm:ss.SSS')

        // TODO: add a requestDate to ui and form
        // TODO: remove vehicle selection from ui!!! the default should be all
        // vehicles, unless one has been eliminated by a usage rule.
        try {
          const { data } = await axios.post(
            '/api/schedule',
            {
              vehicleKeys: ['102', '202'],
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
  }, [
    durationInMinutes,
    vehicleKey,
    errors.durationInMinutes,
    errors.vehicleKey,
  ])

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
