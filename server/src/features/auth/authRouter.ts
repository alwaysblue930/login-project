import { Router } from 'express'
import { verifySchema } from '../../middlewares/verifySchema.js'
import {
  loginController,
  logoutController,
  sendVerificationEmailController,
  testProtectedController,
  verifyEmailController,
} from './authController.js'
import { userLoginSchema } from '../user/userZod.js'
import { verifyAccessToken, verifyRefreshToken } from '../../utils/jwt.js'

const router = Router()

router.route('/login').post(verifySchema(userLoginSchema), loginController)
router
  .route('/logout')
  .get(verifyAccessToken, verifyRefreshToken, logoutController)
router
  .route('/protected')
  .get(verifyAccessToken, verifyRefreshToken, testProtectedController)

router
  .route('/email/new')
  .get(verifyAccessToken, verifyRefreshToken, sendVerificationEmailController)
router.route('/email/verify/:token').get(verifyEmailController)
export default router
