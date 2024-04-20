import { Router } from 'express'
import {
  deleteUserController,
  listController,
  signUpController,
  updatePictureController,
} from './userController.js'
import { verifySchema } from '../../middlewares/verifySchema.js'
import { userSignUpSchema } from './userZod.js'
import multer from 'multer'
import { verifyAccessToken, verifyRefreshToken } from '../../utils/jwt.js'

const upload = multer()
const router = Router()

router.route('/list').get(listController)
router.route('/signup').post(verifySchema(userSignUpSchema), signUpController)
router
  .route('/picture/update')
  .patch(
    verifyAccessToken,
    verifyRefreshToken,
    upload.single('picture'),
    updatePictureController
  )
router
  .route('/delete')
  .delete(verifyAccessToken, verifyRefreshToken, deleteUserController)

export default router
