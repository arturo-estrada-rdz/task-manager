import { Document } from 'mongoose';

export type UserInput = {
  username: string;
  password: string;
  fullname: string;
};

export interface IUser extends UserInput, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}
