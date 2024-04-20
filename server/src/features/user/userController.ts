import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../../middlewares/asyncHandler.js'
import logger from '../../utils/logger.js'
import { deleteUser, userSignUp } from './userService.js'
import { updatePicture } from '../../utils/firebase.js'
import redisClient from '../../utils/redisClient.js'
import createHttpError from 'http-errors'

export const listController = asyncHandler(
  async (_req: Request, _res: Response) => {
    logger.info('listController')
    throw new Error('testing error')
  }
)

export const signUpController = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info('signUpController')
    await userSignUp(req.body)
    return res.status(201).json({ message: 'Sign Up Successful' })
  }
)

export const updatePictureController = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info('updatePictureController')
    await updatePicture(req, res)

    return res.status(200).json({ message: 'Picture Update Successful' })
  }
)

export const deleteUserController = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    logger.info('deleteUserController')
    const user = res.locals.user
    const deleted = await deleteUser(user)
    if (!deleted) {
      return next(createHttpError(400, 'Error while deleting an user'))
    }

    await redisClient.del(user.id)
    res.clearCookie('x-access-token')
    res.clearCookie('x-refresh-token')

    return res.status(200).json({ message: 'User Successfully deleted' })
  }
)
