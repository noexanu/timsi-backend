import { Request, Response } from 'express';
import TokenService from 'services/tokenService';
import UserORM from 'repositories/orm-user';

export default class ApiController {
  static data = async (req: Request, res: Response) => {
    const { accessToken } = req.cookies;
    const { id } = TokenService.getTokenData(accessToken) as any;
    const user = await UserORM.findById(id);
    res.json({
      autorized: true,
      cookies: req.cookies,
      user,
    });
  };
}
