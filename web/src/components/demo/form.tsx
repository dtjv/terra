import * as React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
} from '@chakra-ui/react'
import { object, enums, string, number, date } from 'superstruct'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { Times } from '@/components/demo/times'

/*
interface Times {
  id: number,
  timeISO: string
}
*/

const Schema = object({
  zip: enums(['11', '22']),
  truck: string(),
  bookedAt: date(),
  duration: number(),
})

interface TicketInput {
  zip: string
  truck: string
  duration: number
  bookedAt: Date
}

//type NewTicket = Omit<TicketInput, 'bookedAt'> & {
//  scheduledAt: Date
//}
//

export const Demo: React.FC = () => {
  const {
    //getValues,
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: { truck: '102', bookedAt: undefined, duration: 30 },
    resolver: superstructResolver(Schema, { coerce: true }),
  })
  //const [times, setTimes] = React.useState<Times[]>([])
  //const [bookedAt, setBookedAt] = React.useState<Date | undefined>(undefined)

  //---------------------------------------------------------------------------
  // Effects
  //
  // ** A **
  // if zip changes then
  //   call maps api
  //   if maps api result !== duration then
  //     set duration to maps api result
  //     clear list of times
  //
  // ** B **
  // if truck changes then
  //   clear list of times
  //
  // ** C **
  // if duration & truck exist then
  //   call times api
  //   set list of times
  //
  // C will be a watch component and render a list of times when its props chg.
  //---------------------------------------------------------------------------

  //---------------------------------------------------------------------------
  // Event Handlers
  //---------------------------------------------------------------------------
  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    console.log(`input fields:`, fields)
  }

  console.log(`errors: `, errors)
  console.log(`isValid: `, isValid)

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormControl isInvalid={!!errors.zip} isRequired>
        <FormLabel htmlFor="zip">zip</FormLabel>
        <Input id="zip" {...register('zip')} />
        <FormErrorMessage> {errors?.zip?.message ?? ''} </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.truck} isRequired>
        <FormLabel htmlFor="truck">truck</FormLabel>
        <Select id="truck" {...register('truck')}>
          <option value="102">Truck 102</option>
          <option value="202">Truck 202</option>
        </Select>
        <FormErrorMessage>{errors?.truck?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <Times control={control} />

      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}
