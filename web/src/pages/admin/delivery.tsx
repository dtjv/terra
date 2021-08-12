import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Schedule } from '@/components/schedule'

const Delivery = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Schedule />
    </DndProvider>
  )
}

export default Delivery
