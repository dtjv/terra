# new ticket

    SERVER
    pages/admin/delivery/new-ticket.tsx
      * SSR: grab vehicle data
      -> components/ticket/ticket-create.tsx


    components/ticket/ticket-create.tsx
      * render form wizard
        * components/ticket/form/step-ticket.tsx
        * components/ticket/form/step-contact.tsx
          * components/ticket/form/destination-address.tsx
        * components/ticket/form/step-product.tsx
        * components/ticket/form/step-schedule.tsx
          * components/ticket/form/scheduled-at.tsx


    components/ticket/form/destination-address.tsx
      * API: pages/api/demo/duration.ts
      * sets form field `durationInMinutes`
      ...supposed to be google api. to avoid high charges from hitting api,
         don't run it if not necessary. but that's tricky as rerenders keep
         triggering it.


    components/ticket/form/scheduled-at.tsx
      * API: pages/api/schedule/index.ts
      * for each day returned by API, compute available time slots
        * lib/utils.ts -> getAvailableTimes
      * render available times first by vehicle, then by date


    SERVER
    pages/api/demo/duration.ts
      * returns a random multiple of `timeBlockInMinutes`
      ...should be a call to google api


    SERVER
    pages/api/schedule/index.ts
      <- returns 3 days of tickets (based off vehicles, a date and a time)
         {
           '2021-10-19T00:00:00.000Z': {
             tickets: Ticket[],
             requestDate: Date,
             requestTime: string
           },
           ...
         }


    CLIENT
    lib/utils.ts -> getAvailableTimes
      * find open slots for a new ticket
      ...given a list of all vehicle keys
      ...given a list of all tickets booked on requested date
      ...given a request date, request time and new ticket's duration

      logic:
      * create array of time blocks:
          -> [ '08:00:00.000', '08:30:00.000', ... '13:00:00.000']
      * create a string of 1(open) or 0(!open) for each time block
          if request time is 9:00, mark 8:00 and 8:30 with a 0 (!open)
          -> '0011111111'
      * assign each vehicle this string representation of a day's schedule
          -> { '102': '0011111111', ... }
      * mark 0s in each ticket's time blocks (for assigned vehicle schedule)
          -> ticket for 102 @ 09:00 for 60min === '0011000000' (ticket mask)
          -> ticket for 202 @ 10:30 for 30min === '0000010000' (ticket mask)
          xor ticket's mask against ticket's assigned vehicle schedule to get:
          -> 102:
               (schedule)     (ticket mask)
               '0011111111' ^ '0011000000' => '0000111111'
             202:
               '0011111111' ^ '0000010000' => '0011101111'
      * now, find all slots for each vehicle that can accommodate new ticket
          -> new ticket is 90min long === '1110000000' (new ticket mask)
          -> 102:
               (schedule)     (new ticket mask)
               '0000111111' & '1110000000' !== mask
               '0000111111' & '0111000000' !== mask
               '0000111111' & '0011100000' !== mask
               '0000111111' & '0001110000' !== mask
               '0000111111' & '0000111000' === mask -> save time
               '0000111111' & '0000011100' === mask -> save time
               '0000111111' & '0000001110' === mask -> save time
               '0000111111' & '0000000111' === mask -> save time
          -> repeat for each vehicle
