import crypto from 'crypto'

export default function createPassword(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+'
  let password = ''

  for (let i = 0; i < length; i++) {
    const randomByte = crypto.randomBytes(1)
    const idx = randomByte[0] % characters.length
    password += characters[idx]
  }
  return password
}
