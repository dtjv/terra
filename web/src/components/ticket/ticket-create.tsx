import * as React from 'react'
import {
  Flex,
  VStack,
  Icon,
  Button,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  PanelTicket,
  TabTicket,
  PanelContact,
  TabContact,
  PanelProducts,
  TabProducts,
  PanelSchedule,
  TabSchedule,
} from '@/components/ticket/panels'
import { TicketKind } from '@/types/enums'
import { VehicleContext } from '@/contexts/vehicle-context'
import { TicketTab, TicketNav } from '@/components/ticket'
import type { UseFormReturn } from 'react-hook-form'
import type { Vehicle } from '@/types/types'
import type { TicketInput } from '@/types/types'

interface TicketCreateProps {
  vehicles: Vehicle[]
}

export const TicketCreate = ({ vehicles }: TicketCreateProps) => {
  const [tabIndex, setTabIndex] = React.useState(0)
  const form: UseFormReturn<TicketInput> = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: { ticketKind: TicketKind.DELIVERY, scheduledTime: '' },
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form
  const tabs = [TabTicket, TabContact, TabProducts, TabSchedule]

  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    console.log(`call api w/ fields: `, fields)
  }
  const handleTabChange = (index: number) => {
    setTabIndex(index)
  }

  return (
    <VehicleContext.Provider value={{ vehicles }}>
      <Flex direction="column" mx="auto" px={8}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                h="55px"
                mt={8}
                mb={4}
                d="flex"
                justifyContent="center"
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.200"
              >
                {tabs.map(({ label, icon }, idx) => (
                  <TicketTab
                    key={idx}
                    tabId={idx}
                    tabLabel={label}
                    tabCount={tabs.length}
                    tabSelected={tabIndex}
                  >
                    <Icon as={icon} boxSize={4} />
                  </TicketTab>
                ))}
              </TabList>
              {/* body - scrollable */}
              <TabPanels
                overflowY="auto"
                overscrollBehaviorY="contain"
                h="calc(100vh - 232px)"
              >
                <TabPanel px={0} py={4}>
                  <PanelTicket {...form} />
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <PanelContact {...form} />
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <PanelProducts {...form} />
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <PanelSchedule {...form} />
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
          h="100px"
          w="calc(100% - 280px)"
          py={4}
          px={8}
        >
          <TicketNav
            tabIndex={tabIndex}
            tabCount={tabs.length}
            onClick={setTabIndex}
          >
            <Button
              colorScheme="purple"
              isLoading={isSubmitting}
              onClick={handleSubmit(handleFormSubmit)}
            >
              Create Ticket
            </Button>
          </TicketNav>
        </Flex>
      </Flex>
    </VehicleContext.Provider>
  )
}

export default TicketCreate
