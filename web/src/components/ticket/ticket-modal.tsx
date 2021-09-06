import * as React from 'react'
import {
  VStack,
  Icon,
  Button,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
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
import { TicketKind } from '@/types/enums'
import type { TicketInput } from '@/types/types'

const tabs = [TabTicket, TabContact, TabProducts, TabSchedule]

export interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TicketModal = ({ isOpen, onClose }: TicketModalProps) => {
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
    onClose()
    setTabIndex(0)
    //TODO: if fields are not reset by onClose
    //  add a useEffect to test if form was successfully submitted. if so, clear
    //  fields.
  }

  return (
    <Modal
      scrollBehavior="inside"
      size="full"
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
        //TODO: manually clear out controlled components.
        setTabIndex(0)
      }}
    >
      <ModalOverlay />
      <ModalContent py={8} px={24} bg="white" borderRadius="xl">
        <ModalCloseButton />
        <ModalBody color="gray.700">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={8}>
              <Tabs
                w="100%"
                index={tabIndex}
                onChange={handleTabsChange}
                variant="unstyled"
              >
                <TabList
                  py={2}
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
                <TabPanels>
                  <TabPanel p="0">
                    <PanelTicket {...form} />
                  </TabPanel>
                  <TabPanel p="0">
                    <PanelContact {...form} />
                  </TabPanel>
                  <TabPanel p="0">
                    <PanelProducts {...form} />
                  </TabPanel>
                  <TabPanel p="0">
                    <PanelSchedule {...form} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter pb={0}>
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
