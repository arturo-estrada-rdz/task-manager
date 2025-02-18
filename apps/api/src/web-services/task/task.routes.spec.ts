import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { taskController } from './task.controller';
import router from './task.routes';

jest.mock('./task.controller', () => ({
  taskController: {
    addTask: jest.fn((_req: Request, res: Response) =>
      res.status(201).send('Task added')
    ),
    getTasks: jest.fn((_req: Request, res: Response) =>
      res.status(200).send('Tasks retrieved')
    ),
    getTask: jest.fn((_req: Request, res: Response) =>
      res.status(200).send('Task retrieved')
    ),
    updateTask: jest.fn((_req: Request, res: Response) =>
      res.status(200).send('Task updated')
    ),
    patchTaskStatus: jest.fn((_req: Request, res: Response) =>
      res.status(200).send('Task status updated')
    ),
    deleteTask: jest.fn((_req: Request, res: Response) =>
      res.status(200).send('Task deleted')
    ),
  },
}));

jest.mock('../../middleware/verify-token', () =>
  jest.fn((_req: Request, _res: Response, next: NextFunction) => next())
);

jest.mock('../../middleware/validation', () => ({
  validateRequest: jest.fn(
    () => (_req: Request, _res: Response, next: NextFunction) => next()
  ),
}));

describe('Task Router', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addTask on POST /', async () => {
    const response = await request(app)
      .post('/')
      .send({ title: 'New Task', description: 'Task description' });

    expect(taskController.addTask).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.text).toBe('Task added');
  });

  it('should call getTasks on GET /', async () => {
    const response = await request(app).get('/');

    expect(taskController.getTasks).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe('Tasks retrieved');
  });

  it('should call getTask on GET /:id', async () => {
    const response = await request(app).get('/123');

    expect(taskController.getTask).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe('Task retrieved');
  });

  it('should call updateTask on PUT /:id', async () => {
    const response = await request(app)
      .put('/123')
      .send({ title: 'Updated Task' });

    expect(taskController.updateTask).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe('Task updated');
  });

  it('should call patchTaskStatus on PATCH /:id', async () => {
    const response = await request(app).patch('/123').send({ completed: true });

    expect(taskController.patchTaskStatus).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe('Task status updated');
  });

  it('should call deleteTask on DELETE /:id', async () => {
    const response = await request(app).delete('/123');

    expect(taskController.deleteTask).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe('Task deleted');
  });
});
