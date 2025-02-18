import { Schema, model } from 'mongoose';
import { ITask } from './task.types';

const TaskSchema = new Schema<ITask>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
});

export default model<ITask>('Task', TaskSchema);
