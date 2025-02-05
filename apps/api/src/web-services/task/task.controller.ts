import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthRequest, autoBindMethods } from '../../utils';
import { ITaskRepository } from './task.repository';
import { TaskRepository } from './task.repository.impl';

export class TaskController {
  constructor(private taskRepository: ITaskRepository = new TaskRepository()) {
    autoBindMethods(this);
  }

  async getTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await this.taskRepository.findAll(req.user as string);
      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async addTask(req: AuthRequest, res: Response) {
    try {
      const { title, description, dueDate } = req.body;

      const task = await this.taskRepository.create({
        user: new Types.ObjectId(req.user),
        title,
        description,
        dueDate,
        completed: false,
      });

      return res.status(201).json(task);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const taskController = new TaskController();
