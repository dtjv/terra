import { useDrop } from "react-dnd";
import { GridItem } from "@chakra-ui/react";

import { RowHeader } from "@/components/row-header";
import { Ticket } from "@/components/x-ticket";

interface DragItem {
  type: string;
  id: string;
  time: string;
  truck: string;
  duration: number;
}

export const Cell = ({ cell, grid }) => {
  const makeDndSpec = () => ({
    accept: "TICKET",
    canDrop: (dragItem: DragItem, monitor) => {
      // TODO:
      // - cannot move a ticket that's being processed

      // is ticket dragging over a cell with this ticket? if so, okay!
      //if (monitor.isOver() && dragItem.id === cell.value.ticket?.id) {
      //  return true;
      //}

      // is ticket, with minimum time duration, dragging over an empty cell?
      //if (
      //  monitor.isOver() &&
      //  !cell.value.ticket &&
      //  dragItem.duration === cell.value.timeInterval
      //) {
      //  return true;
      //}

      // can drop on N empty, consecutive cells that match item duration.
      /*
      if (monitor.isOver() && dragItem.duration > cell.value.timeInterval) {
        const numFreeCellsNeeded = dragItem.duration / cell.value.timeInterval

        // is cell at [cell.x, cell.y]     free? 
        // is cell at [cell.x, cell.y + 1] free?
        // is cell at [cell.x, cell.y + 2] free?
      }
      */
      return false;
    },
    drop: (dragItem: DragItem) => {
      // if ticket is dropped on original cell, noop
      // otherwise, update the ticket with this cell's data ( time, truck ).
      /*
      dispatch({
        type: "update",
        payload: { ...dragItem, time: slot.slot, truck: truck.truck },
      }),
     */
    },
    //collect: (monitor) => ({
    //  isOver: !!monitor.isOver(),
    //  canDrop: !!monitor.canDrop(),
    //}),
  });

  const [_, dropRef] = useDrop(makeDndSpec, [cell]);
  const numRows = grid.grid.length;
  const numCols = grid.grid[0].length;

  return (
    <GridItem
      ref={dropRef}
      sx={{
        position: "relative",
        ...(cell.rIdx % 2 !== 0 && cell.rIdx < numRows - 1
          ? {
              borderBottomWidth: "1px",
              borderBottomColor: "gray.600",
            }
          : {}),
        ...(cell.cIdx < numCols - 1
          ? {
              borderRightWidth: "1px",
              borderRightColor: "gray.600",
            }
          : {}),
      }}
    >
      {cell.type === "HEADER" ? (
        <RowHeader height={cell.data.display ? "auto" : "4"}>
          {cell.data.display}
        </RowHeader>
      ) : cell.type === "DATA" && cell.data ? (
        <Ticket ticket={cell.data} timeInterval={grid.intervalInMinutes} />
      ) : (
        <div />
      )}
    </GridItem>
  );
};
