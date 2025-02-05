import { body } from 'express-validator';

export const createTaskValidationRules = [
  body('title').notEmpty().withMessage('Title for this task is required'),
  body('description').optional(),
  body('dueDate').optional().isDate().withMessage('Invalid date format'),
  body('completed').optional(),
];
