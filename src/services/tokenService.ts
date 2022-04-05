import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { TokenData, TokenPayload } from 'types/tokenTypes';

const config = dotenv.config().parsed!;

export default class TokenService {
  public static createAccessToken = (data: TokenData) => {
    const accessTokenSecret = config.JWT_ACCESS_TOKEN_SECRET!;
    const expiresIn = config.JWT_ACCESS_TOKEN_EXPIRES_IN!;
    return jwt.sign(data, accessTokenSecret, {
      expiresIn,
    });
  };

  public static createRefreshToken = (data: TokenData) => {
    const refreshTokenSecret = config.JWT_REFRESH_TOKEN_SECRET!;
    const expiresIn = config.JWT_REFRESH_TOKEN_EXPIRES_IN!;
    return jwt.sign(data, refreshTokenSecret, {
      expiresIn,
    });
  };

  public static createTokens = (data: TokenData) => {
    const accessToken = this.createAccessToken(data);
    const refreshToken = this.createRefreshToken(data);
    return { accessToken, refreshToken };
  };

  public static getTokenData = (token: string) => jwt.decode(token);

  private static verifyToken = (
    token: string,
    secret: jwt.Secret,
    options?: jwt.VerifyOptions,
  ) => {
    try {
      return jwt.verify(token, secret, options);
    } catch {
      return null;
    }
  };

  public static verifyAccessToken = (accessTokent: string) => {
    const accessTokenSecret = config.JWT_ACCESS_TOKEN_SECRET!;
    return this.verifyToken(accessTokent, accessTokenSecret);
  };

  public static verifyRefreshToken = (refreshToken: string) => {
    const refreshTokenSecret = config.JWT_REFRESH_TOKEN_SECRET!;
    return this.verifyToken(refreshToken, refreshTokenSecret);
  };

  public static refreshTokens = (refreshToken: string) => {
    const payload = this.verifyRefreshToken(refreshToken) as TokenPayload;
    return payload ? this.createTokens({ id: payload.id }) : null;
  };
}
