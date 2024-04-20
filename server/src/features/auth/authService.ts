import createHttpError from 'http-errors'
import { OAuthProvider } from '../../types/types.js'
import UserModel from '../user/userModel.js'
import { TUserLogin } from '../user/userZod.js'
import bcrypt from 'bcrypt'

export async function verifyUserLogin(input: TUserLogin) {
  const { email, password } = input
  const userFound = await UserModel.findOne({
    email,
    provider: OAuthProvider.Local,
  })
  if (!userFound) {
    throw createHttpError(404, `User with email ${email} is not found`)
  }
  const match = await bcrypt.compare(password, userFound.password)
  if (!match) {
    throw createHttpError(400, 'Email or password is incorrect')
  }
  return userFound
}

export async function updateVerifyStatus(email: string) {
  const user = await UserModel.findOneAndUpdate(
    {
      email,
      provider: OAuthProvider.Local,
    },
    { isVerified: true },
    { new: true }
  )
  return user
}
