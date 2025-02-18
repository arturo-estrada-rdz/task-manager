import { Types } from 'mongoose';
import Task from './task';
import { ITaskRepository } from './task.repository';
import { ITask, TaskInput } from './task.types';

export class TaskRepository implements ITaskRepository {
  async findAll(userId: string): Promise<ITask[]> {
    return Task.find({ user: new Types.ObjectId(userId) }).exec();
  }

  async findById(id: string, user: string): Promise<ITask | null> {
    return Task.findOne({ _id: id, user }).exec();
  }

  async create(task: TaskInput): Promise<ITask> {
    return new Task(task).save();
  }

  async update(
    id: string,
    user: string,
    task: Partial<ITask>
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate({ _id: id, user }, task, { new: true }).exec();
  }

  async updateField(
    id: string,
    user: string,
    keyValuePair: { [key: string]: string | boolean }
  ) {
    return Task.findOneAndUpdate({ _id: id, user }, keyValuePair, {
      new: true,
    }).exec();
  }

  async delete(id: string, user: string): Promise<ITask | null> {
    return Task.findOneAndDelete({ _id: id, user }).exec();
  }
}
