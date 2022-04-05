import { Request, Response, NextFunction } from 'express';
import TokenService from 'services/tokenService';

export default class AuthMiddleware {
  public static auth = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    const accessTokenPayload = TokenService.verifyAccessToken(accessToken);
    if (accessTokenPayload) {
      next();
      return;
    }

    const newTokens = await TokenService.refreshTokens(refreshToken);
    if (newTokens) {
      res
        .cookie('accessToken', newTokens.accessToken)
        .cookie('refreshToken', newTokens.refreshToken);
      next();
      return;
    }

    res
      .status(401)
      .end();
  };
}
