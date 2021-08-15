import type { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { NotReadyYet } from '@/components/not-ready'
import { ColorModeButtons } from '@/components/color-mode-buttons'

const Settings = () => (
  <Flex direction="column" align="center" justify="center" h="100%">
    <NotReadyYet />
    <ColorModeButtons />
  </Flex>
)

export default Settings

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
