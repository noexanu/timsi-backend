export interface GoogleAccessTokenResponse {
  access_token: string,
  expires_in: number,
  scope: string,
  token_type: string,
  id_token: string,
}

export interface GoogleUserEmailResponce {
  id: string,
  email: string,
  verified_email: boolean,
  picture: string,
}
