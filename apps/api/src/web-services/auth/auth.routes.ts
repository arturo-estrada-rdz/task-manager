import { Router } from 'express';
import { validateRequest } from '../../middleware/validation';
import { authController } from './auth.controller';
import {
  loginValidationRules,
  registerUserValidationRules,
} from './auth.validators';

const router = Router();

router.post(
  '/register',
  validateRequest(registerUserValidationRules),
  authController.registerUser
);

router.post(
  '/login',
  validateRequest(loginValidationRules),
  authController.loginUser
);

export default router;
