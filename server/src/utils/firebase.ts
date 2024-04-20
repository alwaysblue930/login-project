import admin from 'firebase-admin'
import logger from './logger.js'
import { randomUUID } from 'crypto'
import { extname } from 'path'
import { Request, Response } from 'express'
import createHttpError from 'http-errors'
import { TUserJwt } from '../types/types.js'
import { updateUserPicture } from '../features/user/userService.js'
import { convertToJwtUser, signToken } from './jwt.js'

const serviceAccount = {
  type: 'service_account',
  projectId: process.env.FB_PROJECT_ID,
  privateKeyId: process.env.FB_PRIVATE_KEY_ID,
  privateKey: process.env.FB_PRIVATE_KEY,
  clientEmail: process.env.FB_CLIENT_EMAIL,
  clientId: process.env.FB_CLIENT_ID,
  authUri: 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: 'https://oauth2.googleapis.com/token',
  authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FB_CLIENT_CERT,
  universe_domain: 'googleapis.com',
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://portfolio-29134.appspot.com',
})

const bucket = admin.storage().bucket()

export async function updatePicture(req: Request, res: Response) {
  const file = req.file
  if (!file) {
    throw createHttpError(400, 'Image does not exist')
  }
  const uuid = randomUUID()
  const filename = uuid + extname(file.originalname)

  await uploadFile(file, filename)

  const user = res.locals.user as TUserJwt
  if (user.picture !== process.env.FB_DEFAULT_PROFILE) {
    const pictureUrl = user.picture
    try {
      const fileToDelete = getFilenameFromUrl(pictureUrl)
      await deleteFile(fileToDelete)
    } catch {
      logger.info('Could not find file, skip deleting process')
    }
  }

  const url = process.env.FB_STORAGE_URL + filename + '?alt=media'

  const updatedUser = await updateUserPicture(user.id, url)
  if (!updatedUser) {
    throw createHttpError(400, 'Could not update picture')
  }
  const payload = convertToJwtUser(updatedUser)
  await signToken(res, 'access', payload)
  await signToken(res, 'refresh', payload)
}

export async function uploadFile(file: Express.Multer.File, filename: string) {
  try {
    const bucketFile = bucket.file(filename)
    await bucketFile.save(file.buffer)
  } catch (e) {
    logger.error(e)
  }
}

export async function loadFile(fileName: string): Promise<string> {
  const [url] = await bucket.file(fileName).getSignedUrl({
    action: 'read',
    expires: '01-01-2500',
  })
  return url
}

export async function deleteFile(filename: string) {
  const file = bucket.file(filename)
  await file.delete()
}

export function getFilenameFromUrl(url: string) {
  return url.substring(url.lastIndexOf('/') + 1).split('?')[0]
}
