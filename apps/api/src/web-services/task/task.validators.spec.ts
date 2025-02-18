import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { validateRequest } from '../../middleware/validation';
import {
  patchStatusValidationRules,
  taskInputValidationRules,
} from './task.validators';

describe('Validation Rules', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('taskInputValidationRules', () => {
    beforeEach(() => {
      app.post(
        '/',
        validateRequest(taskInputValidationRules),
        (_req: Request, res: Response) => {
          res.status(200).send('Success');
        }
      );
    });

    it('should return errors with messages for the different fields', async () => {
      const response = await request(app).post('/').send({
        title: '',
        dueDate: 'bad-date',
        description: 123,
        completed: 'non boolean value',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        {
          type: 'field',
          value: '',
          msg: 'Title for this task is required',
          path: 'title',
          location: 'body',
        },
        {
          type: 'field',
          value: 123,
          msg: 'Invalid value',
          path: 'description',
          location: 'body',
        },
        {
          type: 'field',
          value: 'bad-date',
          msg: 'Must be an ISO 8601 (tip: cast yourDateValue.toISOString)',
          path: 'dueDate',
          location: 'body',
        },
        {
          type: 'field',
          value: 'non boolean value',
          msg: 'Invalid value',
          path: 'completed',
          location: 'body',
        },
      ]);
    });
  });

  describe('patchStatusValidationRules', () => {
    beforeEach(() => {
      app.patch(
        '/',
        validateRequest(patchStatusValidationRules),
        (_req: Request, res: Response) => {
          res.status(200).send('Success');
        }
      );
    });

    it('should validate that field is not empty and a boolean value is sent', async () => {
      const response = await request(app).patch('/').send({
        completed: null,
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        {
          type: 'field',
          value: null,
          msg: 'Error: "completed" field is required',
          path: 'completed',
          location: 'body',
        },
        {
          type: 'field',
          value: null,
          msg: 'Error: expected boolan value',
          path: 'completed',
          location: 'body',
        },
      ]);
    });
  });
});
