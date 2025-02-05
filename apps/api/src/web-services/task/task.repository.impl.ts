// src/repositories/TaskRepository.ts
import { Types } from 'mongoose';
import Task, { ITask, TaskInput } from './task';
import { ITaskRepository } from './task.repository';

export class TaskRepository implements ITaskRepository {
  async findAll(userId: string): Promise<ITask[]> {
    return Task.find({ user: new Types.ObjectId(userId) }).exec();
  }

  async findById(id: string): Promise<ITask | null> {
    return Task.findById(id).exec();
  }

  async create(task: TaskInput): Promise<ITask> {
    return new Task(task).save();
  }

  async update(id: string, task: Partial<ITask>): Promise<ITask | null> {
    return Task.findByIdAndUpdate(id, task, { new: true }).exec();
  }

  async delete(id: string): Promise<ITask | null> {
    return Task.findByIdAndDelete(id).exec();
  }
}
