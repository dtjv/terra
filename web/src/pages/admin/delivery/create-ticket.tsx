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
import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { TicketTab, TicketNav } from '@/components/ticket'
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
import { AdminLayout } from '@/components/layouts/admin-layout'
import { ScheduleContext } from '@/hooks/use-schedule'
import { getVehicles } from '@/lib/db'
import { toVehicle } from '@/types/utils'
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'
import type { Vehicle, VehicleDocument } from '@/types/types'

const tabs = [TabTicket, TabContact, TabProducts, TabSchedule]

interface CreateTicketProps {
  vehicles: Vehicle[]
}

export const CreateTicket = ({ vehicles }: CreateTicketProps) => {
  const [tabIndex, setTabIndex] = React.useState(0)
  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }
  const form: UseFormReturn<TicketInput> = useForm<TicketInput>({
    mode: 'onTouched',
    defaultValues: { ticketKind: TicketKind.DELIVERY, scheduledTime: '' },
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form
  const handleFormSubmit: SubmitHandler<TicketInput> = (fields) => {
    console.log(`call api w/ fields: `, fields)
    setTabIndex(0)
    //TODO: if fields are not reset by onClose
    //  add a useEffect to test if form was successfully submitted. if so, clear
    //  fields.
  }
  return (
    <ScheduleContext.Provider value={{ vehicles }}>
      <Flex direction="column" mx="auto" px={8}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={8}>
            <Tabs
              w="100%"
              index={tabIndex}
              onChange={handleTabsChange}
              variant="unstyled"
            >
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
    </ScheduleContext.Provider>
  )
}

export default CreateTicket

CreateTicket.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export const getServerSideProps: GetServerSideProps = async () => {
  const vehicleDocs: VehicleDocument[] = await getVehicles()
  const vehicles: Vehicle[] = vehicleDocs.map((vehicleDoc) =>
    toVehicle(vehicleDoc)
  )

  return {
    props: {
      vehicles,
    },
  }
}
