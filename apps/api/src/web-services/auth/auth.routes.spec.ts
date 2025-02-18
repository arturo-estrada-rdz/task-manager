import express, { NextFunction, Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
import request from 'supertest';
import { authController } from './auth.controller';
import router from './auth.routes';

jest.mock('./auth.controller', () => ({
  authController: {
    registerUser: jest.fn((_req: Request, res: Response) =>
      res.status(200).send('Registered')
    ),
    loginUser: jest.fn((_req: Request, res: Response) =>
      res.status(200).send('Logged in')
    ),
  },
}));

jest.mock('../../middleware/validation', () => ({
  validateRequest: jest.fn(
    () => (_req: Request, _res: Response, next: NextFunction) => next()
  ),
}));

describe('Auth Router', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call registerUser on POST /register', async () => {
    const response = await request(app).post('/register').send({
      username: 'testuser',
      password: 'password',
      fullname: 'Test User',
    });

    expect(authController.registerUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe('Registered');
  });

  it('should call loginUser on POST /login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password' });

    expect(authController.loginUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe('Logged in');
  });
});
