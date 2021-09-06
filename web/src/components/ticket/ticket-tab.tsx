import * as React from 'react'
import {
  Divider,
  Tooltip,
  Text,
  HStack,
  Flex,
  chakra,
  useTab,
  useStyles,
} from '@chakra-ui/react'

export interface TicketTabProps {
  tabId: number
  tabCount: number
  tabLabel: string
  tabSelected: number
  children?: React.ReactNode
}

export const TicketTab = React.forwardRef<HTMLButtonElement, TicketTabProps>(
  (props, ref) => {
    const { tabId, tabCount, tabLabel, tabSelected, ...rest } = props
    const tabProps = useTab({ ...rest, ref })
    const styles = useStyles()
    const isSelected = !!tabProps['aria-selected']
    const ticketTab = isSelected ? (
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
            Step {`${tabId + 1}/${tabCount}`}
          </Text>
          <Text fontWeight="semibold">{tabLabel}</Text>
        </Flex>
      </HStack>
    ) : (
      <Tooltip
        px={3}
        py={2}
        label={tabLabel}
        placement="top"
        bg="gray.600"
        color="white"
        borderRadius="2xl"
      >
        <Flex
          p={3}
          sx={{
            ...(tabId < tabSelected
              ? { color: 'purple.500', bg: 'purple.50' }
              : { color: 'gray.500' }),
          }}
          borderRadius="full"
          _hover={{
            ...(tabId < tabSelected
              ? { bg: 'purple.100' }
              : { bg: 'gray.200' }),
          }}
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
          {tabId > 0 && <Divider orientation="vertical" />}
          <Flex
            style={{
              marginRight: '0.5rem',
              ...(tabId === 0 ? { marginLeft: '0.5rem' } : {}),
            }}
            px={4}
            align="center"
            justify="center"
          >
            {ticketTab}
          </Flex>
        </HStack>
      </chakra.button>
    )
  }
)
