import { Request, Response } from 'express'
import logger from '../../utils/logger.js'
import crypto from 'crypto'
import {
  TGithubOptions,
  TGoogleDecoded,
  TGoogleOptions,
  TNaverOptions,
} from './oauthTypes.js'
import qs from 'qs'
import asyncHandler from '../../middlewares/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { OAuthProvider } from '../../types/types.js'
import { createOAuthUser } from './oauthService.js'
import { convertToJwtUser, signToken } from '../../utils/jwt.js'

export const googleInitiate = (_req: Request, res: Response) => {
  logger.info('googleInitate')
  const baseUri = process.env.OAUTH_GOOGLE_INITIATE as string
  const state = crypto.randomBytes(16).toString('hex')
  res.cookie('oauth_state', state, { httpOnly: true, maxAge: 1000 * 60 * 10 })
  const options: TGoogleOptions = {
    response_type: 'code',
    client_id: process.env.OAUTH_GOOGLE_CLIENT as string,
    redirect_uri: process.env.OAUTH_GOOGLE_CALLBACK as string,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ].join(' '),
    state,
  }
  const query = qs.stringify(options)
  const requestUri = `${baseUri}?${query}`

  res.send(requestUri)
}

export const googleCallback = asyncHandler(
  async (_req: Request, res: Response) => {
    logger.info('googleCallback')

    const id_token = res.locals.tokens.id_token
    const decoded = jwt.decode(id_token) as TGoogleDecoded
    const { email, picture } = decoded

    const user = await createOAuthUser(email, picture, OAuthProvider.Google)

    const payload = convertToJwtUser(user)

    await signToken(res, 'access', payload)
    await signToken(res, 'refresh', payload)

    res.redirect('http://localhost:3000')
  }
)

export const githubInitiate = (_req: Request, res: Response) => {
  logger.info('githubInitiate')
  const baseUri = process.env.OAUTH_GITHUB_INITIATE as string
  const state = crypto.randomBytes(16).toString('hex')
  res.cookie('oauth_state', state, { httpOnly: true, maxAge: 1000 * 60 * 10 })
  const options: TGithubOptions = {
    client_id: process.env.OAUTH_GITHUB_CLIENT as string,
    redirect_uri: process.env.OAUTH_GITHUB_CALLBACK as string,
    state,
    scope: 'user',
  }
  const query = qs.stringify(options)
  const requestUri = `${baseUri}?${query}`

  res.send(requestUri)
}

export const githubCallback = asyncHandler(
  async (_req: Request, res: Response) => {
    logger.info('githubCallback')
    const { email, avatar_url } = res.locals.user
    const user = await createOAuthUser(email, avatar_url, OAuthProvider.Github)
    const payload = convertToJwtUser(user)

    await signToken(res, 'access', payload)
    await signToken(res, 'refresh', payload)

    res.redirect('http://localhost:3000')
  }
)

export const naverInitiate = (_req: Request, res: Response) => {
  logger.info('naverInitiate')
  const baseUri = process.env.OAUTH_NAVER_INITIATE as string
  const state = crypto.randomBytes(16).toString('hex')
  res.cookie('oauth_state', state, { httpOnly: true, maxAge: 1000 * 60 * 10 })
  const options: TNaverOptions = {
    response_type: 'code',
    client_id: process.env.OAUTH_NAVER_CLIENT as string,
    redirect_uri: process.env.OAUTH_NAVER_CALLBACK as string,
    state,
  }
  const query = qs.stringify(options)
  const requestUri = `${baseUri}?${query}`

  res.send(requestUri)
}

export const naverCallback = asyncHandler(
  async (_req: Request, res: Response) => {
    logger.info('naverTokenCallback')
    const { email, profile_image } = res.locals.user
    const user = await createOAuthUser(
      email,
      profile_image,
      OAuthProvider.Naver
    )

    const payload = convertToJwtUser(user)

    await signToken(res, 'access', payload)
    await signToken(res, 'refresh', payload)

    res.redirect('http://localhost:3000')
  }
)
