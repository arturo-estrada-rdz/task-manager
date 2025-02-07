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

  async getTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const task = await this.taskRepository.findById(id, user);

      if (!task) return res.status(404).json({ error: 'Task not found' });

      return res.status(200).json(task);
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId')
        return res.status(400).json({ error: 'Invalid ID format' });
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

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const taskRequest = req.body;
      const task = await this.taskRepository.update(id, user, taskRequest);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(task);
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId')
        return res.status(400).json({ error: 'Invalid ID format' });
      return res.status(500).json({ error: err.message });
    }
  }

  async patchTaskStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      const task = await this.taskRepository.updateField(id, req.user, {
        completed,
      });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(task);
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId')
        return res.status(400).json({ error: 'Invalid ID format' });
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const result = await this.taskRepository.delete(id, user);
      if (!result) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json({ message: 'Success!' });
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId')
        return res.status(400).json({ error: 'Invalid ID format' });
      return res.status(500).json({ error: err.message });
    }
  }
}

export const taskController = new TaskController();
