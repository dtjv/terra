export const times = [
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
];

export const trucks = [
  { id: "102", name: "Truck 102" },
  { id: "202", name: "Truck 202" },
  { id: "302", name: "Truck 302" },
];

export const tickets = [
  { id: "A", slot: "8:00 AM", truck: "102", duration: 30 },
  { id: "B", slot: "8:30 AM", truck: "102", duration: 30 },
  { id: "C", slot: "10:00 AM", truck: "102", duration: 60 },
  { id: "D", slot: "8:00 AM", truck: "202", duration: 90 },
  { id: "E", slot: "11:00 AM", truck: "202", duration: 30 },
  { id: "F", slot: "11:30 AM", truck: "202", duration: 30 },
  { id: "G", slot: "8:00 AM", truck: "302", duration: 60 },
];

// useGrid needs to do this work...

export const coords = [
  { x: 2, y: 2, span: 1 },
  { x: 2, y: 3, span: 1 },
  { x: 2, y: 6, span: 2 },
  { x: 3, y: 2, span: 3 },
  { x: 3, y: 8, span: 1 },
  { x: 3, y: 9, span: 1 },
  { x: 4, y: 2, span: 2 },
];

export const enhancedTickets = tickets.map((ticket, i) => ({
  ...ticket,
  ...coords[i],
}));

/*
export const getTicket = (arr, keys) => {
  let a = arr.slice();
  for (const [k, v] of Object.entries(keys)) {
    a = a.filter((o) => o[k] === v);
  }
  return a;
};
*/
