import { NextFunction, Request, Response, RequestHandler } from 'express'

export default function asyncHandler(fn: RequestHandler) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
