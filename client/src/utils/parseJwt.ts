import { jwtDecode } from 'jwt-decode'
import { TUserJwt } from '../types/types'

export const parseAndDecode = () => {
  const accessToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('x-access-token='))
    ?.split('=')[1]
  if (!accessToken) {
    return null
  }
  const decoded = jwtDecode(accessToken) as TUserJwt
  return decoded
}
