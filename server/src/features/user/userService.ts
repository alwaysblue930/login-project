import createHttpError from 'http-errors'
import { OAuthProvider, TUserJwt } from '../../types/types.js'
import UserModel from './userModel.js'
import { TUserSignUp } from './userZod.js'
import { deleteFile, getFilenameFromUrl } from '../../utils/firebase.js'
import logger from '../../utils/logger.js'

export async function userSignUp(input: TUserSignUp) {
  const userExists = await UserModel.findOne({
    email: input.email,
    provider: OAuthProvider.Local,
  }).lean()
  if (userExists) {
    throw createHttpError(409, 'Email is taken')
  }
  const userCreated = await UserModel.create(input)

  return userCreated
}

export async function updateUserPicture(id: string, picture: string) {
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    { picture },
    { new: true }
  )
  return user
}

export async function deleteUser(input: TUserJwt) {
  const { id, picture } = input
  const url = getFilenameFromUrl(picture)
  try {
    await deleteFile(url)
  } catch {
    logger.info(`Tried to delete file ${url}, but couldn't find it`)
  }

  const deleted = await UserModel.deleteOne({ _id: id })
  return deleted.deletedCount === 1
}
