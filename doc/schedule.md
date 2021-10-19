# schedule

    pages/admin/delivery/index.tsx
      * SSR: grab vehicle data
      -> component/schedule.tsx


    component/schedule.tsx
      * call hook/use-schedule
      * render schedule ui
        * define css grid (for header)
        * define css grid (for tickets)
        * helpers...
          * component/schedule/schedule-nav.tsx
          * component/schedule/schedule-col-header.tsx
          * component/schedule/schedule-row-header.tsx
          * component/schedule/schedule-data-cell.tsx


    hook/use-schedule.ts
      * call hook/use-ticket
      * make schedule data structure via:
        * lib/utils.ts -> makeColHeaders
        * lib/utils.ts -> makeScheduleTimes
        * lib/utils.ts -> makeRowHeaders
        * lib/utils.ts -> makeRows
      <- schedule data structure


    hook/use-ticket.ts
      * API: grab tickets
      <- tickets + mutation function


    component/schedule/schedule-data-cell.tsx
      * define grid item as droppable
      * define `canDrop` logic
        * lib/utils.ts -> getPreviousCellWithTicket
        * lib/utils.ts -> isCellCoveredByTicket
        * lib/utils.ts -> isSpaceForTicketAtCell
      * define `drop` logic via ticket mutation function
      * render ticket data
        * components/ticket/ticket-view.tsx

    components/ticket/ticket-view.tsx
      * define as draggable
      * position absolute inside droppable grid item
      * 'div' height is mapped to duration of ticket.

    lib/utils.ts -> makeRows
      * builds an array of `Row` data types

    below is the Row that holds column header cells
    {
      key: "row-0",
      cells: [
        {
          key: "0-0",
          rowIdx: 0,
          colIdx: 0,
          id: "",
          vehicleKey: "",
          vehicleName: "",
          kind: "COL_HEADER",
          display: "",
        },
        {
          key: "0-1",
          rowIdx: 0,
          colIdx: 1,
          id: "61205cc24e45086bab6371dc",
          vehicleKey: "102",
          vehicleName: "Truck 102",
          kind: "COL_HEADER",
          display: "Truck 102",
        },
        {
          key: "0-2",
          rowIdx: 0,
          colIdx: 2,
          id: "61205cc24e45086bab6371dd",
          vehicleKey: "202",
          vehicleName: "Truck 202",
          kind: "COL_HEADER",
          display: "Truck 202",
        },
      ],
    }

    this Row holds a row header cell in the first column and then data cells in
    the next two. notice, both data cells hold tickets of different duration.

    {
      key: "row-1",
      cells: [
        {
          key: "1-0",
          rowIdx: 1,
          colIdx: 0,
          time: "08:00:00.000",
          timeHour: "8 AM",
          timeHourMinute: "8:00 AM",
          kind: "ROW_HEADER",
          display: "8 AM",
        },
        {
          key: "1-1",
          rowIdx: 1,
          colIdx: 1,
          kind: "DATA_CELL",
          rowHeader: {
            time: "08:00:00.000",
            timeHour: "8 AM",
            timeHourMinute: "8:00 AM",
          },
          colHeader: {
            id: "61205cc24e45086bab6371dc",
            vehicleKey: "102",
            vehicleName: "Truck 102",
          },
          ticket: {
            id: "6169ddeb5599bd3591142208",
            ticketKind: "Delivery",
            firstName: "Rena",
            lastName: "Checchi",
            email: "caz@to.kh",
            phone: "(314) 447-6993",
            destinationAddress: {
              state: "OR",
              street: "Lezah Highway",
              unit: "",
              city: "Portland",
              zip: "97229",
            },
            vehicleKey: "102",
            scheduledAt: "2021-10-19T00:00:00.000Z",
            scheduledTime: "08:00:00.000",
            durationInMinutes: 60,
            vehicleDoc: {
              _id: "61205cc24e45086bab6371dc",
              vehicleKey: "102",
              vehicleName: "Truck 102",
              __v: 0,
              id: "61205cc24e45086bab6371dc",
            },
            scheduledTimeRange: "8:00am - 9:00am",
          },
        },
        {
          key: "1-2",
          rowIdx: 1,
          colIdx: 2,
          kind: "DATA_CELL",
          rowHeader: {
            time: "08:00:00.000",
            timeHour: "8 AM",
            timeHourMinute: "8:00 AM",
          },
          colHeader: {
            id: "61205cc24e45086bab6371dd",
            vehicleKey: "202",
            vehicleName: "Truck 202",
          },
          ticket: {
            id: "6169ddeb5599bd359114220f",
            ticketKind: "Delivery",
            firstName: "Genevieve",
            lastName: "Faber",
            email: "cozejwas@didcep.rs",
            phone: "(507) 427-4134",
            destinationAddress: {
              state: "OR",
              street: "Zeub Center",
              unit: "",
              city: "Salem",
              zip: "97305",
            },
            vehicleKey: "202",
            scheduledAt: "2021-10-19T00:00:00.000Z",
            scheduledTime: "08:00:00.000",
            durationInMinutes: 30,
            vehicleDoc: {
              _id: "61205cc24e45086bab6371dd",
              vehicleKey: "202",
              vehicleName: "Truck 202",
              __v: 0,
              id: "61205cc24e45086bab6371dd",
            },
            scheduledTimeRange: "8:00am - 8:30am",
          },
        },
      ],
    }


    this Row holds a row header cell and two data cells - each without a ticket.

    {
      key: "row-2",
      cells: [
        {
          key: "2-0",
          rowIdx: 2,
          colIdx: 0,
          time: "08:30:00.000",
          timeHour: "8 AM",
          timeHourMinute: "8:30 AM",
          kind: "ROW_HEADER",
          display: "",
        },
        {
          key: "2-1",
          rowIdx: 2,
          colIdx: 1,
          kind: "DATA_CELL",
          rowHeader: {
            time: "08:30:00.000",
            timeHour: "8 AM",
            timeHourMinute: "8:30 AM",
          },
          colHeader: {
            id: "61205cc24e45086bab6371dc",
            vehicleKey: "102",
            vehicleName: "Truck 102",
          },
        },
        {
          key: "2-2",
          rowIdx: 2,
          colIdx: 2,
          kind: "DATA_CELL",
          rowHeader: {
            time: "08:30:00.000",
            timeHour: "8 AM",
            timeHourMinute: "8:30 AM",
          },
          colHeader: {
            id: "61205cc24e45086bab6371dd",
            vehicleKey: "202",
            vehicleName: "Truck 202",
          },
        },
      ],
    },
