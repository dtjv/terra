import { HStack, Button } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'

export interface TicketNavProps {
  tabIndex: number
  tabCount: number
  onClick: (tabIndex: number) => void
  children?: React.ReactNode
}

export const TicketNav = ({
  tabIndex,
  tabCount,
  onClick,
  children,
}: TicketNavProps) => {
  return (
    <HStack w="100%" mb={2} spacing={3} justifyContent="flex-end">
      {tabIndex > 0 && (
        <Button
          colorScheme="gray"
          variant="ghost"
          leftIcon={<FaArrowLeft />}
          onClick={() => onClick(tabIndex - 1)}
        >
          Back
        </Button>
      )}
      {tabIndex === tabCount - 1 ? (
        children
      ) : (
        <Button colorScheme="purple" onClick={() => onClick(tabIndex + 1)}>
          Next Step
        </Button>
      )}
    </HStack>
  )
}
