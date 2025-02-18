import express, { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
import request from 'supertest';
import { validateRequest } from '../../middleware/validation';
import {
  loginValidationRules,
  registerUserValidationRules,
} from './auth.validators';

describe('Validation Rules', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('loginValidationRules', () => {
    beforeEach(() => {
      app.post(
        '/login',
        validateRequest(loginValidationRules),
        (_req: Request, res: Response) => {
          res.status(200).send('Success');
        }
      );
    });

    it('should return errors for invalid username and password', async () => {
      const response = await request(app).post('/login').send({
        username: 'invalid-email',
        password: 'short',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Must provide a valid email',
          path: 'username',
          type: 'field',
          value: 'invalid-email',
        },
        {
          location: 'body',
          msg: 'Invalid value',
          path: 'password',
          type: 'field',
          value: 'short',
        },
      ]);
    });

    it('should pass for valid username and password', async () => {
      const response = await request(app).post('/login').send({
        username: 'test@example.com',
        password: 'validpassword',
      });

      expect(response.status).toBe(200);
    });
  });

  describe('registerUserValidationRules', () => {
    beforeEach(() => {
      app.post(
        '/register',
        validateRequest(registerUserValidationRules),
        (_req: Request, res: Response) => {
          res.status(200).send('Success');
        }
      );
    });

    it('should return errors for missing fullname, invalid username and short password', async () => {
      const response = await request(app).post('/register').send({
        username: 'invalid-email',
        password: 'short',
        fullname: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Must provide a valid email',
          path: 'username',
          type: 'field',
          value: 'invalid-email',
        },
        {
          location: 'body',
          msg: 'Invalid value',
          path: 'password',
          type: 'field',
          value: 'short',
        },
        {
          location: 'body',
          msg: 'Fullname is required',
          path: 'fullname',
          type: 'field',
          value: '',
        },
      ]);
    });

    it('should pass for valid username, password, and fullname', async () => {
      const response = await request(app).post('/register').send({
        username: 'test@example.com',
        password: 'validpassword',
        fullname: 'Test User',
      });

      expect(response.status).toBe(200);
    });
  });
});
