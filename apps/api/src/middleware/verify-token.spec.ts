import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../utils'; // Adjust the path as necessary
import auth from './verify-token'; // Adjust the path as necessary

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('auth middleware', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should respond with 401 if no Authorization header is present', () => {
    (req.header as jest.Mock).mockReturnValueOnce(null);

    auth(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No token, authorization denied',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond with 401 if token is invalid', () => {
    (req.header as jest.Mock).mockReturnValueOnce('Bearer invalidtoken');
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    auth(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    const userId = '1234';
    (req.header as jest.Mock).mockReturnValueOnce('Bearer validtoken');
    (jwt.verify as jest.Mock).mockReturnValueOnce({ id: userId });

    auth(req as AuthRequest, res as Response, next);

    expect(req.user).toBe(userId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
