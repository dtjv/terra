import * as React from 'react'
import { useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'

interface TicketInput {
  zip: string
  truck: string
  duration: number
  bookedAtISO: string
}

const wait = (ms: number) => new Promise((success) => setTimeout(success, ms))
const rand = (min = 1, max = 4): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const api = async (): Promise<number> => {
  console.log(`calculating duration...`)
  await wait(2000)
  return 30 * rand()
}

export const Zip = ({
  control,
  register,
  setValue,
  formState: { errors },
}: UseFormReturn<TicketInput>) => {
  const zip = useWatch({
    control,
    name: 'zip',
  })

  React.useEffect(() => {
    ;(async () => {
      if (!errors.zip && (zip === '11' || zip === '22')) {
        const results = await api()
        console.log(`-> duration:`, results)
        setValue('duration', results)
      }
    })()
  }, [zip])

  return (
    <>
      <FormControl isInvalid={!!errors.zip} isRequired>
        <FormLabel htmlFor="zip">zip</FormLabel>
        <Input id="zip" {...register('zip')} />
        <FormErrorMessage> {errors?.zip?.message ?? ''} </FormErrorMessage>
      </FormControl>
    </>
  )
}
