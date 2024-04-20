import { Router } from 'express'
import {
  githubCallback,
  githubInitiate,
  googleCallback,
  googleInitiate,
  naverCallback,
  naverInitiate,
} from './oauthController.js'
import {
  githubCodeExchange,
  githubTokenExchange,
  googleCodeExchange,
  naverCodeExchange,
  naverTokenExchange,
} from './oauthMiddleware.js'

const router = Router()

router.route('/google').get(googleInitiate)
router.route('/google/callback').get(googleCodeExchange, googleCallback)

router.route('/github').get(githubInitiate)
router
  .route('/github/callback')
  .get(githubCodeExchange, githubTokenExchange, githubCallback)

router.route('/naver').get(naverInitiate)
router
  .route('/naver/callback')
  .get(naverCodeExchange, naverTokenExchange, naverCallback)

export default router
