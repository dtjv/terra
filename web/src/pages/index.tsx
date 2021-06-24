import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Schedule } from '@/components/schedule'

const Home = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Schedule />
    </DndProvider>
  )
}

export default Home
