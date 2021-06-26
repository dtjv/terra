import path from 'path'
import * as fs from 'fs/promises'

import type { AppData } from '@/types/types'

export const getData = async (): Promise<AppData | undefined> => {
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
