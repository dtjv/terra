import path from 'path'
import * as fs from 'fs/promises'

export const getData = async () => {
  try {
    const data = await fs.readFile(
      path.resolve(__dirname, '../data/data.json'),
      'utf8'
    )
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read data file')
  }

  return undefined
}
