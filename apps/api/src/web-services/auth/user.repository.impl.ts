import User from './user';
import { IUserRepository } from './user.repository';
import { IUser, UserInput } from './user.types';

export class UserRepository implements IUserRepository {
  findAll(): Promise<IUser[]> {
    return User.find().exec();
  }

  findById(id: string): Promise<IUser> {
    return User.findById(id).exec();
  }

  findByEmail(username: string): Promise<IUser> {
    return User.findOne({ username }).exec();
  }

  create(user: UserInput): Promise<IUser> {
    return new User(user).save();
  }

  update(id: string, user: UserInput): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, user).exec();
  }

  delete(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id).exec();
  }
}
