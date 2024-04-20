import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import redisClient from '../utils/redisClient.js'
import { TUser } from '../features/user/userZod.js'
import logger from './logger.js'
import { OAuthProvider, TUserJwt } from '../types/types.js'
import createHttpError from 'http-errors'

export function convertToJwtUser(user: TUser): TUserJwt {
  const { id, email, provider, picture, isVerified } = user

  return { id, email, provider: provider as OAuthProvider, picture, isVerified }
}

export async function signToken(
  res: Response,
  type: 'access' | 'refresh',
  payload: TUserJwt
) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    audience: payload.id,
    expiresIn:
      type === 'access'
        ? process.env.ACCESS_TOKEN_TTL
        : process.env.REFRESH_TOKEN_TTL,
  })
  if (type === 'access') {
    res.cookie('x-access-token', token, {
      httpOnly: false,
      maxAge: 1000 * 60 * 15,
    })
  } else {
    await redisClient.setEx(payload.id, 60 * 60 * 24 * 365, token)
    res.cookie('x-refresh-token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
  }
}

export function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies['x-access-token']
    logger.info(`Verifying Access Token: ${accessToken}`)

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string)
    res.locals.user = decoded

    return next()
  } catch (e) {
    logger.error(e)
    return next(e)
  }
}

export async function verifyRefreshToken(
  _err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies['x-refresh-token']
    logger.info(`Verifying Refresh Token: ${refreshToken}`)

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string)

    const { email, id, picture, isVerified, provider } = decoded as TUserJwt
    res.locals.user = decoded

    const payload = { email, id, picture, isVerified, provider }

    const tokenFromDB = await redisClient.get(id)
    if (tokenFromDB !== refreshToken) {
      logger.error('Refresh Token does not match the one from redis cache')
      return next(createHttpError(401, 'Unauthorized Access'))
    }
    await signToken(res, 'access', payload)
    logger.info('New access token is generated from refresh token')
    return next()
  } catch (e) {
    logger.error(e)
    return next(e)
  }
}
