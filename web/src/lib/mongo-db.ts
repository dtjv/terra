import { connect, STATES } from 'mongoose'

let isConnected = false

const composeDbURI = () => {
  const dbPath = process.env['DB_PATH']
  const dbUser = process.env['DB_USER']
  const dbPass = process.env['DB_PASS']
  const dbName = process.env['DB_NAME']

  if (!dbPath) throw new Error(`Missing env var 'DB_PATH'`)
  if (!dbUser) throw new Error(`Missing env var 'DB_USER'`)
  if (!dbPass) throw new Error(`Missing env var 'DB_PASS'`)
  if (!dbName) throw new Error(`Missing env var 'DB_NAME'`)

  return dbPath
    .replace(/\$DB_USER/, dbUser)
    .replace(/\$DB_PASS/, dbPass)
    .replace(/\$DB_NAME/, dbName)
}

export const connectToDB = async (): Promise<boolean> => {
  let db = null

  if (isConnected) return isConnected

  try {
    db = await connect(composeDbURI(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    const connection = db.connections[0]

    isConnected = !!connection && STATES[connection.readyState] === 'connected'
  } catch (error) {
    console.error(error)
  }

  return isConnected
}
