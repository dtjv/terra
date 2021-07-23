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

interface TicketInput {
  zip: string
  truck: string
  duration: number
  bookedAtISO: string
}

interface TimesData {
  id: number
  dateISO: string
}

const wait = (ms: number) => new Promise((success) => setTimeout(success, ms))
const rand = (min = 3, max = 6): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

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

export const Times = ({
  control,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const duration = useWatch({
    control,
    name: 'duration',
  })
  const truck = useWatch({
    control,
    name: 'truck',
  })
  const [times, setTimes] = React.useState<TimesData[]>([])

  React.useEffect(() => {
    ;(async () => {
      if (!errors.duration && !errors.truck) {
        const results = await api()
        console.log(`-> times:`, results)
        setTimes(results)
      }
    })()
  }, [duration, truck])

  return (
    <>
      {times.length > 0 ? (
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Pick a time:</FormLabel>
          <Controller
            name="bookedAtISO"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <RadioGroup
                name="bookedAtISO"
                onChange={onChange}
                value={value}
                ref={ref}
              >
                <Stack>
                  {times.map(({ id, dateISO }) => {
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
