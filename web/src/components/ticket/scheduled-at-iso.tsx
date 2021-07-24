import * as React from 'react'
import { useWatch, Controller } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import type { TicketInput } from '@/types/types'

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
const api = async (): Promise<TimesData[]> => {
  console.log(`retrieving times...`)
  await wait(2000)
  return Array(rand())
    .fill({})
    .map((_, i) => ({
      id: i + 1,
      dateISO: `2021-09-05T0${i + 1}:00:00.000Z`,
    }))
}

export const ScheduleAtISO: React.FC<UseFormReturn<TicketInput>> = ({
  control,
  formState: { errors },
}) => {
  const durationInMinutes = useWatch({ control, name: 'durationInMinutes' })
  const vehicleKey = useWatch({ control, name: 'vehicleKey' })
  const [timeChoices, setTimeChoices] = React.useState<TimesData[]>([])

  React.useEffect(() => {
    ;(async () => {
      if (!errors.durationInMinutes && !errors.vehicleKey) {
        const choices = await api()
        console.log(`-> time choices:`, choices)
        setTimeChoices(choices)
      }
    })()
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
