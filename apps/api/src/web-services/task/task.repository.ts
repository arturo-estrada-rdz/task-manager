import { ITask, TaskInput } from './task';

export interface ITaskRepository {
  findAll(userId: string): Promise<ITask[]>;
  findById(id: string): Promise<ITask | null>;
  create(task: TaskInput): Promise<ITask>;
  update(id: string, task: Partial<ITask>): Promise<ITask | null>;
  delete(id: string): Promise<ITask | null>;
}
