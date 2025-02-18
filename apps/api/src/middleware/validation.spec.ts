import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import request from 'supertest';
import { validateRequest } from './validation';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('validateRequest middleware', () => {
  const app = express();
  app.use(express.json());

  app.post('/', validateRequest([]), (_req: Request, res: Response) =>
    res.status(200).json({ message: 'done' })
  );

  const validationResultMock = validationResult as unknown as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if there are no validation errors', async () => {
    validationResultMock.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const response = await request(app).post('/').expect(200);
    expect(response.body).toEqual({ message: 'done' });
    expect(validationResultMock).toHaveBeenCalled();
  });

  it('should respond with 400 status and errors if validation fails', async () => {
    const mockErrors = [{ msg: 'Invalid value', param: 'name' }];

    validationResultMock.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => mockErrors,
    });

    const response = await request(app).post('/').expect(400);
    expect(response.body).toEqual({ errors: mockErrors });
    expect(validationResultMock).toHaveBeenCalled();
  });
});
