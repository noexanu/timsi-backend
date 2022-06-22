export interface TokenData {
  id: string,
}

export interface TokenPayload extends TokenData {
  iat: number,
  exp: number,
}
