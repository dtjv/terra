import { format, addMinutes } from "date-fns";
import isFunction from "lodash.isfunction";

//-----------------------------------------------------------------------------
//
// raw data
//
//-----------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------
//
// utils
//
//-----------------------------------------------------------------------------

const generateTimeList = (sTime, eTime, iTime, formatter) => {
  const dates = [];

  let d = new Date(2021, 0, 1, sTime, 0, 0);

  while (sTime < eTime) {
    dates.push(d);
    d = addMinutes(d, iTime);
    sTime = d.getHours();
  }

  return isFunction(formatter) ? dates.map(formatter) : dates;
};

const aggregateData = () => {
  const data = [];
  const times = generateTimeList(8, 18, 30, (date) => format(date, "h:mm a"));

  for (let i = 0; i < times.length; i += 1) {
    const rowHeader = tableRows[i];
    const row = {};

    for (let j = 0; j < tableCols.length; j += 1) {
      const col = tableCols[j];

      if (j === 0) {
        row[col.accessor] = rowHeader;
      } else {
        const [ticket] = tickets.filter(
          (ticket) => ticket.time === times[i] && ticket.truck === col.id
        );
        row[col.accessor] = ticket ? ticket.id : "";
      }
    }

    data.push(row);
  }

  return data;
};

//-----------------------------------------------------------------------------
//
// build data
//
//-----------------------------------------------------------------------------

/*
 * ['8 AM', '', '9 AM', '', ... '5 PM', '']
 */
export const tableRows = generateTimeList(8, 18, 30, (date, i) => {
  return i % 2 !== 0 ? "" : format(date, "h a");
});

/*
 * [
 *   { id: "000", header: '', accessor: 'col0' },
 *   { id: "102", header: 'Truck 102', accessor: 'col1' },
 *   ...
 * ]
 */
export const tableCols = [
  { id: "000", header: "", accessor: "col0" },
  ...trucks.map((truck, i) => ({
    id: truck.id,
    header: truck.name,
    accessor: `col${i + 1}`,
  })),
];

/*
 * [
 *   { col0: '8 AM', col1: 'A', col2: 'D', col3: 'G' },
 *   { col0: '', col1: 'B', col2: '', col3: '' },
 *   { col0: '9 AM', col1: '', col2: '', col3: '' },
 *   ...
 * ]
 */
export const tableData = aggregateData();
