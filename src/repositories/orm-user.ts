import { getConnection } from 'typeorm';
import User from 'entities/user';

export default class UserORM {
  static create = async (user: User) => {
    const userRepository = getConnection().getRepository(User);
    await userRepository.save(user);
    return this;
  };

  static delete = async (user: User) => {
    const userRepository = getConnection().getRepository(User);
    await userRepository.delete(user);
    return this;
  };

  static findByEmail = async (email: string) => {
    const userRepository = getConnection().getRepository(User);
    const existingUser = await userRepository.findOne({ email });
    return existingUser;
  };

  static findById = async (id: string) => {
    const userRepository = getConnection().getRepository(User);
    const existingUser = await userRepository.findOne({ id });
    return existingUser;
  };

  static findOrCreate = async (user: User) => {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) return existingUser;
    await this.create(user);
    return user;
  };

  static findAll = async () => {
    const userRepository = getConnection().getRepository(User);
    const usersArray = await userRepository.find();
    return usersArray;
  };

  static deleteAll = async () => {
    const users = await this.findAll();
    users.forEach((user) => this.delete(user));
    return this;
  };
}
