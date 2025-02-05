import mongoose, { Document, Schema } from 'mongoose';

export type TaskInput = {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
};

export interface ITask extends TaskInput, Document {}

const TaskSchema = new mongoose.Schema<ITask>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
});

export default mongoose.model<ITask>('Task', TaskSchema);
