import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { Schema } from 'zod'

export const verifySchema = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req.body)
    if (!parsedData.success) {
      return next(
        createHttpError(400, 'Zod Error', { zod: parsedData.error.issues })
      )
    }
    return next()
  }
}
