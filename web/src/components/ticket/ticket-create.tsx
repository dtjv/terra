import * as React from 'react'
import hexAlpha from 'hex-alpha'
import {
  Flex,
  VStack,
  Icon,
  Button,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToken,
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  HeaderTab,
  FooterNav,
  StepTicket,
  ticketTab,
  StepContact,
  contactTab,
  StepProduct,
  productTab,
  StepSchedule,
  scheduleTab,
  ScheduledAppt,
} from '@/components/ticket/form'
import { TicketKind } from '@/types/enums'
import { VehicleContext } from '@/contexts/vehicle-context'
import type { Vehicle } from '@/types/types'
import type { TicketInput } from '@/types/types'

interface TicketCreateProps {
  vehicles: Vehicle[]
}

export const TicketCreate = ({ vehicles }: TicketCreateProps) => {
  const [tabIndex, setTabIndex] = React.useState(0)
  const form = useForm<TicketInput>({
    mode: 'onChange',
    defaultValues: {
      ticketKind: TicketKind.DELIVERY,
      scheduledTime: '',
      destinationAddress: { state: 'OR' },
    },
  })
  const purple600a5 = hexAlpha(useToken('colors', 'purple.600'), 0.5)
  const {
    getValues,
    trigger,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form
  const tabs = [ticketTab, contactTab, productTab, scheduleTab]
  const scheduleFields = getValues([
    'vehicleKey',
    'scheduledAt',
    'scheduledTime',
  ])
  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    // a double check. submit button is disabled when form state is invalid.
    if (isValid) {
      console.log(`FIELDS: `, fields)
    }
  }
  const handleTabChange = (index: number) => {
    setTabIndex(index)
  }
  const handlePrevClick = React.useCallback(
    () => setTabIndex(tabIndex - 1),
    [tabIndex]
  )
  const handleNextClick = React.useCallback(async () => {
    let isFormValid = true

    if (tabIndex === 1) {
      isFormValid = await trigger(
        [
          'firstName',
          'lastName',
          'phone',
          'destinationAddress.street',
          'destinationAddress.city',
          'destinationAddress.zip',
        ],
        { shouldFocus: true }
      )
    }

    if (isFormValid) {
      setTabIndex(tabIndex + 1)
    }
  }, [tabIndex, trigger])

  return (
    <VehicleContext.Provider value={{ vehicles }}>
      <Flex direction="column" mx="auto" px={8}>
        <form>
          <VStack spacing={8}>
            <Tabs
              w="100%"
              index={tabIndex}
              onChange={handleTabChange}
              variant="unstyled"
            >
              {/* header */}
              <TabList
                position="sticky"
                top={0}
                mt={6}
                px="2px"
                py={3}
                d="flex"
                justifyContent="center"
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.200"
                boxShadow="md"
              >
                {tabs.map(({ label, icon }, idx) => (
                  <HeaderTab
                    key={idx}
                    tabId={idx}
                    tabLabel={label}
                    tabCount={tabs.length}
                    tabSelected={tabIndex}
                  >
                    <Icon as={icon} boxSize={4} />
                  </HeaderTab>
                ))}
              </TabList>
              {/* body - scrollable */}
              <TabPanels
                pt={2}
                overflowY="auto"
                overscrollBehaviorY="contain"
                h="calc(100vh - 208px)"
              >
                <TabPanel px={0} py={4}>
                  <StepTicket {...form} />
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <StepContact {...form} />
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <StepProduct {...form} />
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <StepSchedule {...form} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </form>
        {/* footer */}
        <Flex
          position="fixed"
          bottom={0}
          left={280}
          h="125px"
          w="calc(100% - 280px)"
          minW="680px"
          py={4}
          px={8}
          bg="gray.50"
          borderTopWidth="1px"
          justifyContent="space-between"
        >
          <Flex align="center">
            <ScheduledAppt
              vehicles={vehicles}
              vehicleKey={scheduleFields[0]}
              scheduledAt={scheduleFields[1]}
              scheduledTime={scheduleFields[2]}
            />
          </Flex>
          <FooterNav
            tabIndex={tabIndex}
            tabCount={tabs.length}
            onPrev={handlePrevClick}
            onNext={handleNextClick}
          >
            <Button
              colorScheme="purple"
              _focus={{
                boxShadow: `0 0 0 3px ${purple600a5}`,
              }}
              isDisabled={!isValid}
              isLoading={isSubmitting}
              loadingText="Submitting"
              onClick={handleSubmit(handleFormSubmit)}
            >
              Create Ticket
            </Button>
          </FooterNav>
        </Flex>
      </Flex>
    </VehicleContext.Provider>
  )
}

export default TicketCreate
