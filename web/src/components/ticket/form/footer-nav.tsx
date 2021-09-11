import hexAlpha from 'hex-alpha'
import { HStack, Button, useToken } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'

export interface FooterNavProps {
  tabIndex: number
  tabCount: number
  onPrev: () => void
  onNext: () => void
  children?: React.ReactNode
}

export const FooterNav = ({
  tabIndex,
  tabCount,
  onPrev,
  onNext,
  children,
}: FooterNavProps) => {
  const purple600 = useToken('colors', 'purple.600')
  const purple600a5 = hexAlpha(purple600, 0.5)

  return (
    <HStack px="2px" spacing={3} justify="flex-end">
      {tabIndex > 0 && (
        <Button
          colorScheme="gray"
          variant="ghost"
          leftIcon={<FaArrowLeft />}
          onClick={() => onPrev()}
          _focus={{
            bg: 'gray.200',
          }}
        >
          Back
        </Button>
      )}
      {tabIndex === tabCount - 1 ? (
        children
      ) : (
        <Button
          colorScheme="purple"
          _focus={{
            boxShadow: `0 0 0 3px ${purple600a5}`,
          }}
          onClick={() => onNext()}
        >
          Next Step
        </Button>
      )}
    </HStack>
  )
}
