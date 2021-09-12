import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const wait = (ms: number) => new Promise((success) => setTimeout(success, ms))

const rand = (min = 3, max = 6): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//------------------------------------------------------------------------------
// `/api/demo/times`
//------------------------------------------------------------------------------
// TODO: remove
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { zip } = req.body
  const factor =
    zip === '97301' ? rand() : zip === '97302' ? rand(2, 6) : rand(3, 7)
  await wait(3000)
  return res.status(200).json(30 * factor)
}

export default handler
