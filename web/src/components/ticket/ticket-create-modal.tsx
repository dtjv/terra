import * as React from 'react'
import {
  Divider,
  VStack,
  Tooltip,
  Text,
  HStack,
  Icon,
  Button,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Flex,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  chakra,
  useTab,
  useStyles,
} from '@chakra-ui/react'
import {
  FaTicketAlt,
  FaRegCalendarCheck,
  FaLeaf,
  FaUser,
  FaArrowLeft,
} from 'react-icons/fa'

interface TabHeaderProps {
  label: string
  tabId: number
  tabCount: number
  tabSelected: number
  children?: React.ReactNode
}

const TabHeader = React.forwardRef<HTMLButtonElement, TabHeaderProps>(
  (props, ref) => {
    const tabProps = useTab({ ...props, ref })
    const styles = useStyles()
    const isSelected = !!tabProps['aria-selected']
    const renderTabHeader = isSelected ? (
      <HStack spacing={4}>
        <Flex
          p={3}
          align="center"
          justify="center"
          color="white"
          bg="purple.600"
          borderRadius="full"
        >
          {tabProps.children}
        </Flex>
        <Flex direction="column" align="flex-start">
          <Text fontSize="xs" fontWeight="medium" color="purple.600">
            Step {`${props.tabId + 1}/${props.tabCount}`}
          </Text>
          <Text fontWeight="semibold">{props.label}</Text>
        </Flex>
      </HStack>
    ) : (
      <Tooltip
        px={3}
        py={2}
        label={props.label}
        placement="top"
        bg="gray.600"
        color="white"
        borderRadius="2xl"
      >
        <Flex
          p={3}
          sx={{
            ...(props.tabId < props.tabSelected
              ? { color: 'purple.500', bg: 'purple.50' }
              : { color: 'gray.500' }),
          }}
          borderRadius="full"
          _hover={{ bg: 'gray.200' }}
        >
          {tabProps.children}
        </Flex>
      </Tooltip>
    )

    return (
      <chakra.button
        __css={styles['tab']}
        p={0}
        {...tabProps}
        _focus={{}}
        flex={isSelected ? 1 : 0}
      >
        <HStack h="100%">
          {props.tabId > 0 && <Divider orientation="vertical" />}
          <Flex
            style={{
              marginRight: '0.5rem',
              ...(props.tabId === 0 ? { marginLeft: '0.5rem' } : {}),
            }}
            px={4}
            align="center"
            justify="center"
          >
            {renderTabHeader}
          </Flex>
        </HStack>
      </chakra.button>
    )
  }
)

export interface TicketCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TicketCreateModal = ({
  isOpen,
  onClose,
}: TicketCreateModalProps) => {
  const [tabIndex, setTabIndex] = React.useState(0)
  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setTabIndex(0)
      }}
    >
      <ModalOverlay />
      <ModalContent bg="gray.50" borderRadius="xl">
        <ModalHeader fontSize="2xl">New Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody color="gray.700">
          <VStack spacing={8}>
            <Tabs
              w="100%"
              index={tabIndex}
              onChange={handleTabsChange}
              variant="unstyled"
            >
              <TabList
                py="4"
                d="flex"
                justifyContent="center"
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <TabHeader
                  tabId={0}
                  tabCount={4}
                  tabSelected={tabIndex}
                  label="Type of Ticket"
                >
                  <Icon as={FaTicketAlt} boxSize={4} />
                </TabHeader>
                <TabHeader
                  tabId={1}
                  tabCount={4}
                  tabSelected={tabIndex}
                  label="Contact Details"
                >
                  <Icon as={FaUser} boxSize={4} />
                </TabHeader>
                <TabHeader
                  tabId={2}
                  tabCount={4}
                  tabSelected={tabIndex}
                  label="Product List"
                >
                  <Icon as={FaLeaf} boxSize={4} />
                </TabHeader>
                <TabHeader
                  tabId={3}
                  tabCount={4}
                  tabSelected={tabIndex}
                  label="Schedule Appt."
                >
                  <Icon as={FaRegCalendarCheck} boxSize={4} />
                </TabHeader>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p>1</p>
                  <Button
                    colorScheme="purple"
                    onClick={() => setTabIndex(tabIndex + 1)}
                  >
                    Next
                  </Button>
                </TabPanel>
                <TabPanel>
                  <p>2</p>
                  <Button
                    colorScheme="gray"
                    variant="ghost"
                    leftIcon={<FaArrowLeft />}
                    onClick={() => setTabIndex(tabIndex - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    colorScheme="purple"
                    onClick={() => setTabIndex(tabIndex + 1)}
                  >
                    Next
                  </Button>
                </TabPanel>
                <TabPanel>
                  <p>3</p>
                  <Button
                    colorScheme="gray"
                    variant="ghost"
                    leftIcon={<FaArrowLeft />}
                    onClick={() => setTabIndex(tabIndex - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    colorScheme="purple"
                    onClick={() => setTabIndex(tabIndex + 1)}
                  >
                    Next
                  </Button>
                </TabPanel>

                <TabPanel>
                  <p>4</p>
                  <Button
                    colorScheme="gray"
                    variant="ghost"
                    leftIcon={<FaArrowLeft />}
                    onClick={() => setTabIndex(tabIndex - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    colorScheme="purple"
                    onClick={() => console.log('create ticket')}
                  >
                    Create Ticket
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
