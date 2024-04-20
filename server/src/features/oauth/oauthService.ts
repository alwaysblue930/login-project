import { OAuthProvider } from '../../types/types.js'
import createPassword from '../../utils/createPassword.js'
import logger from '../../utils/logger.js'
import UserModel from '../user/userModel.js'

export async function createOAuthUser(
  email: string,
  picture: string,
  provider: OAuthProvider
) {
  logger.info('createOauthUser')

  const userFound = await UserModel.findOne({ email, provider })
  if (userFound) {
    return userFound
  }

  const randomPassword = createPassword(16)
  const user = await UserModel.create({
    email,
    picture,
    isVerified: true,
    password: randomPassword,
    provider,
  })
  return user
}
