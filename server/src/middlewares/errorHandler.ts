import { HttpError } from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger.js'

export default function errorHandler(
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    if (err.zod) {
      return res
        .status(err.statusCode)
        .json({ error: err.message, zod: err.zod })
    } else if (err.statusCode === 500) {
      return res.status(500).json({ error: 'Internal Server Error' })
    } else {
      return res.status(err.statusCode).json({ error: err.message })
    }
  } else {
    logger.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
