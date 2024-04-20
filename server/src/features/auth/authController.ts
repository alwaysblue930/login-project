import { Request, Response } from 'express'
import asyncHandler from '../../middlewares/asyncHandler.js'
import logger from '../../utils/logger.js'
import { updateVerifyStatus, verifyUserLogin } from './authService.js'
import { convertToJwtUser, signToken } from '../../utils/jwt.js'
import jwt from 'jsonwebtoken'
import { TEmailJwt, TUserJwt } from '../../types/types.js'
import redisClient from '../../utils/redisClient.js'
import { sendEmail } from '../../utils/sendEmail.js'

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info('loginController')
    const user = await verifyUserLogin(req.body)
    const payload = convertToJwtUser(user)
    await signToken(res, 'access', payload)
    await signToken(res, 'refresh', payload)

    return res.status(200).json({ message: 'Login Successful' })
  }
)

export const logoutController = asyncHandler(
  async (_req: Request, res: Response) => {
    logger.info('logoutController')
    const user = res.locals.user

    await redisClient.del(user.id)
    res.clearCookie('x-access-token')
    res.clearCookie('x-refresh-token')

    return res.status(200).json({ message: 'Logout Successful' })
  }
)

export const sendVerificationEmailController = asyncHandler(
  async (_req: Request, res: Response) => {
    logger.info('sendVerificationEmailController')
    await sendEmail(res.locals.user.email)

    res.send('Email sent')
  }
)

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    logger.info('verifyEmailController')
    const { token } = req.params
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TEmailJwt

    const user = await updateVerifyStatus(decoded.email)
    if (!user) {
      return res.redirect('http://localhost:3000/auth/email/error')
    }

    const payload = convertToJwtUser(user)
    await signToken(res, 'access', payload)
    await signToken(res, 'refresh', payload)

    res.redirect('http://localhost:3000/auth/email/success')
  } catch (e) {
    logger.error(e)
    res.redirect('http://localhost:3000/auth/email/error')
  }
}

export const testProtectedController = asyncHandler(
  async (_req: Request, res: Response) => {
    logger.info('testProtectedController')

    return res.status(200).json({ message: 'protected route test successful' })
  }
)
