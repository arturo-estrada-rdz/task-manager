import { IUser, UserInput } from './user.types';

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser>;
  findByEmail(username: string): Promise<IUser>;
  create(user: UserInput): Promise<IUser>;
  update(id: string, user: UserInput): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
}
