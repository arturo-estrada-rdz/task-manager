import { body } from 'express-validator';

export const loginValidationRules = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isEmail()
    .withMessage('Must provide a valid email'),

  body('password').notEmpty().isLength({ min: 6 }),
];

export const registerUserValidationRules = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isEmail()
    .withMessage('Must provide a valid email'),

  body('password').notEmpty().isLength({ min: 6 }),

  body('fullname').notEmpty().withMessage('Fullname is required'),
];
