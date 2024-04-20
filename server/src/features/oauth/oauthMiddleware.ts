import { Request, Response, NextFunction } from 'express'
import logger from '../../utils/logger.js'
import qs from 'qs'
import axios from 'axios'
import createHttpError from 'http-errors'

export const googleCodeExchange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('googleCodeExchange')

  const state = req.cookies['oauth_state']
  if (!state || state !== req.query.state) {
    return next(createHttpError(400, 'Cannot validate state parameter'))
  }

  const baseUri = 'https://oauth2.googleapis.com/token'
  const options = {
    grant_type: 'authorization_code',
    client_id: process.env.OAUTH_GOOGLE_CLIENT as string,
    client_secret: process.env.OAUTH_GOOGLE_SECRET as string,
    code: req.query.code as string,
    redirect_uri: process.env.OAUTH_GOOGLE_CALLBACK as string,
  }
  const query = qs.stringify(options)
  const requestUri = `${baseUri}?${query}`
  try {
    const result = await axios.post(requestUri)
    res.locals.tokens = result.data
    return next()
  } catch (e) {
    logger.error(e)
    return next(e)
  }
}

export const githubCodeExchange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('githubCodeExchange')

  const state = req.cookies['oauth_state']
  if (!state || state !== req.query.state) {
    return next(createHttpError(400, 'Cannot validate state parameter'))
  }

  const baseUri = process.env.OAUTH_GITHUB_TOKEN as string
  const payload = {
    client_id: process.env.OAUTH_GITHUB_CLIENT as string,
    client_secret: process.env.OAUTH_GITHUB_SECRET as string,
    redirect_uri: process.env.OAUTH_GITHUB_CALLBACK as string,
    code: req.query.code as string,
  }

  try {
    const result = await axios.post(baseUri, payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    res.locals.tokens = result.data
    return next()
  } catch (e) {
    logger.error(e)
    return next(e)
  }
}

export const githubTokenExchange = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('githubTokenExchange')

  const tokens = res.locals.tokens

  try {
    const user = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    res.locals.user = user.data
    return next()
  } catch (e) {
    logger.error(e)
    return next(e)
  }
}

export const naverCodeExchange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('naverCodeExchange')

  const state = req.cookies['oauth_state']
  if (!state || state !== req.query.state) {
    return next(createHttpError(400, 'Cannot validate state parameter'))
  }

  const baseUri = 'https://nid.naver.com/oauth2.0/token'
  const options = {
    grant_type: 'authorization_code',
    client_id: process.env.OAUTH_NAVER_CLIENT as string,
    client_secret: process.env.OAUTH_NAVER_SECRET as string,
    code: req.query.code as string,
    state,
  }
  const query = qs.stringify(options)
  const requestUri = `${baseUri}?${query}`
  try {
    const result = await axios.get(requestUri)
    res.locals.tokens = result.data
    return next()
  } catch (e) {
    logger.error(e)
    return next(e)
  }
}

export const naverTokenExchange = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('naverTokenExchange')

  const tokens = res.locals.tokens

  try {
    const user = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    res.locals.user = user.data.response
    return next()
  } catch (e) {
    logger.error(e)
    return next(e)
  }
}
