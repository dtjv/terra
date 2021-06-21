import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { XSchedule } from "@/components/x-schedule";

const XDelivery = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <XSchedule />
    </DndProvider>
  );
};

export default XDelivery;
