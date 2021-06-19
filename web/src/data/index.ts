import * as _ from "lodash";
import { format, addMinutes } from "date-fns";

const startTime = 8;
const endTime = 18;
const timeInterval = 30;

const trucks = [
  { id: "102", name: "Truck 102" },
  { id: "202", name: "Truck 202" },
  { id: "302", name: "Truck 302" },
];

const tickets = [
  { id: "A", time: "8:00 AM", truck: "102", duration: 30 },
  { id: "B", time: "8:30 AM", truck: "102", duration: 30 },
  { id: "C", time: "10:00 AM", truck: "102", duration: 60 },
  { id: "D", time: "8:00 AM", truck: "202", duration: 90 },
  { id: "E", time: "11:00 AM", truck: "202", duration: 30 },
  { id: "F", time: "11:30 AM", truck: "202", duration: 30 },
  { id: "G", time: "8:00 AM", truck: "302", duration: 60 },
];

/*
 * Given start and end times, returns a list of date/time values every interval.
 *
 * Example::
 *
 *   sTime = 8  // 24 hr
 *   eTime = 10 // 24 hr
 *   iTime = 30 // minutes
 *
 * Result:
 *   [
 *     2021-01-01T16:00:00.000Z,
 *     2021-01-01T16:30:00.000Z,
 *     2021-01-01T17:00:00.000Z,
 *     2021-01-01T17:30:00.000Z
 *   ]
 */
const generateDateTimeList = (sTime, eTime, iTime = 30) => {
  const dates = [];

  let d = new Date(2021, 0, 1, sTime, 0, 0);

  while (sTime < eTime) {
    dates.push(d);
    d = addMinutes(d, iTime);
    sTime = d.getHours();
  }

  return dates;
};

/*
 * ['8 AM', '', '9 AM', '', ... '5 PM', '']
 */
const rowHeaders = generateDateTimeList(startTime, endTime, timeInterval).map(
  (date, i) => {
    return i % 2 !== 0 ? "" : format(date, "h a");
  }
);

/*
 * [
 *   { id: "000", header: '', accessor: 'col0' },
 *   { id: "102", header: 'Truck 102', accessor: 'col1' },
 *   ...
 * ]
 */
export const colHeaders = [
  { id: "000", header: "", accessor: "col0" },
  ...trucks.map((truck, i) => ({
    id: truck.id,
    header: truck.name,
    accessor: `col${i + 1}`,
  })),
];

/*
 * Groups tickets by time, then by truck - for faster lookups
 */
const groupTickets = () => {
  const ticketsByTime = _.groupBy(tickets, (ticket) => ticket.time);
  const ticketsByTimeAndTruck = Object.keys(ticketsByTime).reduce(
    (result, time) => ({
      ...result,
      [time]: _.keyBy(ticketsByTime[time], "truck"),
    }),
    {}
  );

  return ticketsByTimeAndTruck;
};

/*
 * Builds the data portion required by react-table's `useTable`.
 */
const aggregateData = () => {
  const times = generateDateTimeList(
    startTime,
    endTime,
    timeInterval
  ).map((date) => format(date, "h:mm a"));
  const ticketHash = groupTickets();
  const data = [];

  times.forEach((time, tIdx) => {
    const row = {};

    colHeaders.forEach((col, cIdx) => {
      row[col.accessor] =
        cIdx === 0
          ? rowHeaders[tIdx]
          : { ticket: _.get(ticketHash, [time, col.id]), timeInterval };
    });

    data.push(row);
  });

  return data;
};

/*
 * Result:
 *   [
 *     {
 *       col0: '8 AM',
 *       col1: {
 *         ticket: { id: 'A', time: '8:00 AM', truck: '102', duration: 30 },
 *         timeInterval: 30
 *       },
 *       col2: {
 *         ticket: { id: 'D', time: '8:00 AM', truck: '202', duration: 90 },
 *         timeInterval: 30
 *       },
 *       col3: {
 *         ticket: { id: 'G', time: '8:00 AM', truck: '302', duration: 60 },
 *         timeInterval: 30
 *       }
 *     },
 *     {
 *       col0: '',
 *       col1: {
 *         ticket: { id: 'B', time: '8:30 AM', truck: '102', duration: 30 },
 *         timeInterval: 30
 *       },
 *       col2: { ticket: undefined, timeInterval: 30 },
 *       col3: { ticket: undefined, timeInterval: 30 }
 *     },
 *   ]
 */
export const tableData = aggregateData();
