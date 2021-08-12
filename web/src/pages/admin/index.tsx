import type { ReactElement } from 'react'
import { Button, useColorMode } from '@chakra-ui/react'
import { AdminLayout } from '@/components/layouts/admin-layout'

const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </header>
  )
}

const Admin = () => {
  return <ToggleColorMode />
}

export default Admin

Admin.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
