import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthController } from './auth.controller';
import { IUserRepository } from './user.repository';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let userRepository: jest.Mocked<IUserRepository>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as never;

    authController = new AuthController(userRepository);

    req = {
      body: {},
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return a token', async () => {
      req.body = {
        username: 'testuser',
        password: 'testpass',
        fullname: 'Test User',
      };

      const mockUser = { _id: 'userId', ...req.body };
      userRepository.create.mockResolvedValueOnce(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await authController.registerUser(req as Request, res as Response);

      expect(userRepository.create).toHaveBeenCalledWith(req.body);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id },
        process.env.JWT_SECRET
      );
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should handle duplicate username error', async () => {
      req.body = {
        username: 'testuser',
        password: 'testpass',
        fullname: 'Test User',
      };

      const duplicateError = new Error('Duplicate key error');
      (duplicateError as any).code = 11000;
      userRepository.create.mockRejectedValueOnce(duplicateError);

      await authController.registerUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('should handle other errors', async () => {
      req.body = {
        username: 'testuser',
        password: 'testpass',
        fullname: 'Test User',
      };

      const generalError = new Error('Some error');
      userRepository.create.mockRejectedValueOnce(generalError);

      await authController.registerUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Some error' });
    });
  });

  describe('loginUser', () => {
    it('should log in a user and return a token', async () => {
      req.body = { username: 'testuser', password: 'testpass' };

      const mockUser = {
        _id: 'userId',
        username: 'testuser',
        comparePassword: jest.fn().mockResolvedValueOnce(true),
      };
      userRepository.findByEmail.mockResolvedValueOnce(mockUser as never);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await authController.loginUser(req as Request, res as Response);

      expect(userRepository.findByEmail).toHaveBeenCalledWith('testuser');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('testpass');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id },
        process.env.JWT_SECRET
      );
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should return 404 if user is not found', async () => {
      req.body = { username: 'testuser', password: 'testpass' };

      userRepository.findByEmail.mockResolvedValueOnce(null);

      await authController.loginUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 400 if credentials are invalid', async () => {
      req.body = { username: 'testuser', password: 'testpass' };

      const mockUser = {
        _id: 'userId',
        username: 'testuser',
        comparePassword: jest.fn().mockResolvedValueOnce(false),
      };
      userRepository.findByEmail.mockResolvedValueOnce(mockUser as never);

      await authController.loginUser(req as Request, res as Response);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('testpass');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should handle errors during login', async () => {
      req.body = { username: 'testuser', password: 'testpass' };

      const generalError = new Error('Some error');
      userRepository.findByEmail.mockRejectedValueOnce(generalError);

      await authController.loginUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Some error' });
    });
  });
});
