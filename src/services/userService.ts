import User from 'entities/user';
import TokenService from './tokenService';

export default class UserService {
  public static createTokens = (user: User) => TokenService.createTokens({
    id: user.id,
  });
}
