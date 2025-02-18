import { Response } from 'express';
import { Error, Types } from 'mongoose';
import { AuthRequest } from '../../utils';
import { TaskController } from './task.controller';
import { ITaskRepository } from './task.repository';
import { ITask } from './task.types';

jest.mock('./task.repository.impl');

describe('TaskController', () => {
  let taskController: TaskController;
  let taskRepository: jest.Mocked<ITaskRepository>;
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    taskRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateField: jest.fn(),
      delete: jest.fn(),
    };

    taskController = new TaskController(taskRepository);

    req = {
      user: new Types.ObjectId().toString(),
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return tasks for the user', async () => {
      const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
      taskRepository.findAll.mockResolvedValueOnce(mockTasks as never);

      await taskController.getTasks(req as AuthRequest, res as Response);

      expect(taskRepository.findAll).toHaveBeenCalledWith(req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle errors when getting tasks', async () => {
      const error = new Error('Database error');
      taskRepository.findAll.mockRejectedValueOnce(error);

      await taskController.getTasks(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getTask', () => {
    it('should return a task if found', async () => {
      const mockTask = { title: 'Task 1' };
      req.params.id = 'taskId';
      taskRepository.findById.mockResolvedValueOnce(mockTask as never);

      await taskController.getTask(req as AuthRequest, res as Response);

      expect(taskRepository.findById).toHaveBeenCalledWith('taskId', req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 if task not found', async () => {
      req.params.id = 'taskId';
      taskRepository.findById.mockResolvedValueOnce(null);

      await taskController.getTask(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should handle invalid ID format', async () => {
      const error = { name: 'CastError', kind: 'ObjectId' };
      taskRepository.findById.mockRejectedValueOnce(error);

      await taskController.getTask(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should throw unhandled exception', async () => {
      const error = new Error('Unhandled exception');
      taskRepository.findById.mockRejectedValueOnce(error);

      await taskController.getTask(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('addTask', () => {
    it('ahould add task successfully', async () => {
      const newTask = { title: 'Task 1' };
      const userId = new Types.ObjectId().toString();
      const taskId = new Types.ObjectId().toString();
      const expectedResult = {
        ...newTask,
        _id: taskId,
        user: new Types.ObjectId(userId),
        dueDate: undefined,
        completed: false,
      } as ITask;

      taskRepository.create.mockResolvedValue(expectedResult);

      await taskController.addTask(req as AuthRequest, res as Response);

      expect(taskRepository.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should return 400 when a CastError occurs', async () => {
      const error = { name: 'CastError', kind: 'ObjectId' };
      taskRepository.create.mockRejectedValueOnce(error);

      await taskController.addTask(req as AuthRequest, res as Response);

      expect(taskRepository.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 500 when an unhandled exception occurs', async () => {
      const error = new Error('Unhandled Exception');
      taskRepository.create.mockRejectedValueOnce(error);

      await taskController.addTask(req as AuthRequest, res as Response);

      expect(taskRepository.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateTask', () => {
    it('should update task with success response', async () => {
      const taskId = new Types.ObjectId().toString();
      const taskUpdate: Partial<ITask> = {
        title: 'A new title',
        completed: false,
      };

      const expectedResult = {
        ...taskUpdate,
        _id: taskId,
        user: req.user as unknown as Types.ObjectId,
      } as ITask;

      req.params = { id: taskId };
      req.body = taskUpdate;

      taskRepository.update.mockResolvedValueOnce(expectedResult);

      await taskController.updateTask(req as AuthRequest, res as Response);

      expect(taskRepository.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should return 404 if task is not found', async () => {
      req.params.id = 'taskId';
      taskRepository.update.mockResolvedValueOnce(null);

      await taskController.updateTask(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should return 400 when a CastError occurs', async () => {
      const error = { name: 'CastError', kind: 'ObjectId' };

      req.params.id = 'taskId';
      taskRepository.update.mockRejectedValueOnce(error);

      await taskController.updateTask(req as AuthRequest, res as Response);

      expect(taskRepository.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 500 when an unhandled exception occurs', async () => {
      const error = new Error('Unhandled Exception');

      req.params.id = 'taskId';
      taskRepository.update.mockRejectedValueOnce(error);

      await taskController.updateTask(req as AuthRequest, res as Response);

      expect(taskRepository.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('patchTaskStatus', () => {
    it('should patch "completed" successfully', async () => {
      const theTask: Partial<ITask> = {
        _id: new Types.ObjectId().toString(),
        title: 'Some task',
        completed: false,
      };

      const expectedResult = {
        ...theTask,
        completed: true,
      } as ITask;

      req.params.id = theTask._id.toString();
      req.body = { completed: true };

      taskRepository.updateField.mockResolvedValueOnce(expectedResult);

      await taskController.patchTaskStatus(req as AuthRequest, res as Response);

      expect(taskRepository.updateField).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should return 404 if task not found', async () => {
      req.params.id = 'taskId';
      taskRepository.updateField.mockResolvedValueOnce(null);

      await taskController.patchTaskStatus(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should return 400 when a CastError occurs', async () => {
      const error = { name: 'CastError', kind: 'ObjectId' };

      req.params.id = 'taskId';
      taskRepository.updateField.mockRejectedValueOnce(error);

      await taskController.patchTaskStatus(req as AuthRequest, res as Response);

      expect(taskRepository.updateField).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 500 when an unhandled exception occurs', async () => {
      const error = new Error('Unhandled Exception');
      taskRepository.updateField.mockRejectedValueOnce(error);

      await taskController.patchTaskStatus(req as AuthRequest, res as Response);

      expect(taskRepository.updateField).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deleteTask', () => {
    it('should delete task sucessfully', async () => {
      req.params = { id: 'taskId' };
      taskRepository.delete.mockResolvedValue({ _id: 'taskId' } as ITask);

      await taskController.deleteTask(req as AuthRequest, res as Response);

      expect(taskRepository.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it('should return 404 if task not found', async () => {
      req.params.id = 'taskId';
      taskRepository.delete.mockResolvedValueOnce(null);

      await taskController.deleteTask(req as AuthRequest, res as Response);

      expect(taskRepository.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should return 400 when a CastError occurs', async () => {
      const error = { name: 'CastError', kind: 'ObjectId' };

      req.params.id = 'taskId';
      taskRepository.delete.mockRejectedValueOnce(error);

      await taskController.deleteTask(req as AuthRequest, res as Response);

      expect(taskRepository.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 500 when an unhandled exception occurs', async () => {
      const error = new Error('Unhandled Exception');
      taskRepository.delete.mockRejectedValueOnce(error);

      await taskController.deleteTask(req as AuthRequest, res as Response);

      expect(taskRepository.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
