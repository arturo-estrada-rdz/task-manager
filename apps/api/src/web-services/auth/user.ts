import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';

export type UserInput = {
  username: string;
  password: string;
  fullname: string;
};

export interface IUser extends UserInput, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
