import { IconButton, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export const ColorModeButtons = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <>
      {colorMode === 'light' ? (
        <IconButton
          aria-label="dark theme"
          icon={<MoonIcon />}
          onClick={toggleColorMode}
        />
      ) : (
        <IconButton
          aria-label="light theme"
          icon={<SunIcon />}
          onClick={toggleColorMode}
        />
      )}
    </>
  )
}
