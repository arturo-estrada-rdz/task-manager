import mongoose, { Document } from 'mongoose';

export type TaskInput = {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
};

export interface ITask extends TaskInput, Document {}
