export enum OAuthProvider {
  Local = 'local',
  Google = 'google',
  Github = 'github',
  Naver = 'naver',
}

export type TUserJwt = {
  email: string
  id: string
  picture: string
  isVerified: boolean
  provider: OAuthProvider
}

export type TEmailJwt = {
  email: string
}
