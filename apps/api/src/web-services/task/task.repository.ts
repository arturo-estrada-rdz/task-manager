import { ITask, TaskInput } from './task.types';

export interface ITaskRepository {
  findAll(userId: string): Promise<ITask[]>;
  findById(id: string, user: string): Promise<ITask | null>;
  create(task: TaskInput): Promise<ITask>;
  update(id: string, user: string, task: Partial<ITask>): Promise<ITask | null>;
  updateField(
    id: string,
    user: string,
    keyValuePair: { [key: string]: string | boolean }
  ): Promise<ITask | null>;
  delete(id: string, user: string): Promise<ITask | null>;
}
