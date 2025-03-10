import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export const validateRequest = (rules: ValidationChain[]) => {
  return [
    ...rules,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};
