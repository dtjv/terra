import axios from 'axios'
import { format } from 'date-fns'
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

// TODO: remove
interface AvailableSlot {
  key: number
  vehicleKey: string
  scheduledAt: string
  scheduledTime: string
  scheduledAtFull: string
}

// TODO: use react-query so we're not always calling api on re-render
// TODO: this is a generic useAPI hook!
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

export const ScheduleAt = ({
  control,
  //setValue,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const vehicleKey = useWatch({ control, name: 'vehicleKey' })
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const { getTimesAPI } = useTime()

  useEffect(() => {
    ;(async () => {
      if (
        vehicleKey &&
        durationInMinutes &&
        !errors.vehicleKey &&
        !errors.durationInMinutes
      ) {
        let slots: AvailableSlot[] = []

        try {
          slots = await getTimesAPI()
        } catch (error) {
          if (!getTimesAPI.isCanceled(error)) {
            throw error // TODO: should i throw?
          }
        }

        setAvailableSlots(slots)
      }
    })()
    return () => getTimesAPI.cancel()
  }, [
    getTimesAPI,
    durationInMinutes,
    vehicleKey,
    errors.durationInMinutes,
    errors.vehicleKey,
  ])

  // TODO:
  //
  // 1. custom 'onChange' will call 'setValue' to update form state.
  // 3. 'scheduledAt' is hooked up to DateSchema for coercion, but it won't
  //    create the date correctly - i need to split the incoming string and
  //    construct date as 'new Date(year, month, date)'
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
                onChange={(e) => {
                  console.log(`event: `, e)
                  onChange(e)
                }}
                value={value ? value.toString() : ''}
                ref={ref}
              >
                <Stack>
                  {availableSlots.map((slot) => {
                    // TODO: the value must hold 'scheduledAt' and
                    // 'scheduledTime', so the onChange handler can set
                    // scheduledTime.
                    // can't do onSubmit, 'cause this field has been coerced
                    return (
                      <Radio key={slot.key} value={JSON.stringify(slot)}>
                        {format(new Date(slot.scheduledAtFull), 'PPPPpp')}
                        <Text as="span" fontWeight="bold">
                          {' '}
                          ({slot.vehicleKey}){' '}
                        </Text>
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
