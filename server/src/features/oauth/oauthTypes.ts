import { JwtPayload } from 'jsonwebtoken'

export type TGoogleOptions = {
  client_id: string
  response_type: 'code'
  redirect_uri: string
  state: string
  scope: string
}

export type TGoogleDecoded = JwtPayload & {
  email: string
  picture: string
}

export type TNaverOptions = {
  client_id: string
  response_type: 'code'
  redirect_uri: string
  state: string
}

export type TGithubOptions = {
  client_id: string
  redirect_uri: string
  state: string
  scope: string
}
