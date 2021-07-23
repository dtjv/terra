import * as React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  Button,
  Select,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { object, enums, string, number } from 'superstruct'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { Times } from '@/components/demo/times'
import { Zip } from '@/components/demo/zip'

const Schema = object({
  zip: enums(['11', '22']),
  truck: string(),
  bookedAtISO: string(),
  duration: number(),
})

interface TicketInput {
  zip: string
  truck: string
  duration: number
  bookedAtISO: string
}

export const Demo: React.FC = () => {
  const form: UseFormReturn<TicketInput> = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: { truck: '102', bookedAtISO: '', duration: 30 },
    resolver: superstructResolver(Schema, { coerce: true }),
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form

  //---------------------------------------------------------------------------
  // Effects
  //
  // ** A **
  // if zip changes then
  //   [x] call maps api
  //   if maps api result !== duration then
  //     [x] set duration to maps api result
  //     [x] clear list of times
  //
  // ** B **
  // if duration | truck change then
  //   [x] call times api
  //   [x] render new list of times
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
      <Zip {...form} />

      <FormControl isInvalid={!!errors.truck} isRequired>
        <FormLabel htmlFor="truck">truck</FormLabel>
        <Select id="truck" {...register('truck')}>
          <option value="102">Truck 102</option>
          <option value="202">Truck 202</option>
        </Select>
        <FormErrorMessage>{errors?.truck?.message ?? ''}</FormErrorMessage>
      </FormControl>

      <Times {...form} />

      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}
