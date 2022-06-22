import User from 'entities/user';
import UserORM from 'repositories/orm-user';
import UserService from 'services/userService';
import argon2 from 'argon2';

export default class AuthService {
  static login = async (user: User) => {
    const existingUser = await UserORM.findByEmail(user.email);
    if (existingUser) {
      const passwordIsValid = await argon2.verify(
        existingUser.password!,
        user.password!,
      );
      if (passwordIsValid) return UserService.createTokens(existingUser);
    }
    return null;
  };

  static register = async (user: User) => {
    const existingUser = await UserORM.findByEmail(user.email);
    if (!existingUser) {
      await UserORM.create(user);
      return UserService.createTokens(user);
    }
    return null;
  };
}
