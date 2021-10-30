import minimist from 'minimist'

import { loadTickets } from './load-tickets'
import { loadVehicles } from './load-vehicles'
import type { RC } from '@/types/types'

const usage = `
  Usage: yarn db --load=<collection> [options]

  Options:
    --date=<date>   Date on tickets. Use format 'yyyy-M-dd'. (default=today)
    --key=<key>     New vehicle key to add.
    --bulk=<count>  Number of days from '--date' to add tickets. (default=0)
    --drop          Drop collection. (default=false)
    -h, --help      Show this help message.

  Notes:
    1. You must set DOTENV_CONFIG_PATH to a '.env.*' file.

  Examples:
    $ export DOTENV_CONFIG_PATH=./.env.development.local

    // remove all tickets. add new tickets for 2021-9-31
    $ yarn db --load=tickets --date=2021-9-31 --drop

    // adds tickets for today
    $ yarn db --load=tickets

    // adds tickets for the next 20 days (from today)
    $ yarn db --load=tickets --bulk=20

    // reload default vehicles + vehicle 103
    $ yarn db --load=vehicles --key=103 --drop
`

const showHelp = (message?: string) => {
  if (message) {
    console.log(`\n  ${message}`)
  }
  console.log(usage)
  process.exit(0)
}

const main = async () => {
  const args = minimist(process.argv.slice(2))
  const load = args?.['load']
  const help = Boolean(args?.['h']) || Boolean(args?.['help'])

  if (help) {
    showHelp()
  }

  if (!process.env['DOTENV_CONFIG_PATH']) {
    showHelp('❌ ERROR: DOTENV_CONFIG_PATH is not set. (See Notes below)')
  }

  let rc: RC = { message: 'Completed', success: true }

  switch (load) {
    case 'tickets':
      rc = await loadTickets(args)
      break
    case 'vehicles':
      rc = await loadVehicles(args)
      break
    default:
      showHelp(`Error: Invalid load flag. Use 'tickets' or 'vehicles'.`)
  }

  if (rc.error) {
    console.error(rc.error)
    process.exit(1)
  }

  if (!rc.success) {
    showHelp(rc.message)
  }

  process.exit(0)
}

main()
