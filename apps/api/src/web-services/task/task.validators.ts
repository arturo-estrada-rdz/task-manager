import { body } from 'express-validator';

export const taskInputValidationRules = [
  body('title').notEmpty().withMessage('Title for this task is required'),
  body('description').optional().isString(),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Must be an ISO 8601 (tip: cast yourDateValue.toISOString)'),
  body('completed').optional().isBoolean(),
];

export const patchStatusValidationRules = [
  body('completed')
    .notEmpty()
    .withMessage('Error: "completed" field is required')
    .isBoolean()
    .withMessage('Error: expected boolan value'),
];
