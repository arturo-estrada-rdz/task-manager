import { Router } from 'express';
import { validateRequest } from '../../middleware/validation';
import auth from '../../middleware/verify-token';
import { taskController } from './task.controller';
import { createTaskValidationRules } from './task.validators';

const router = Router();

router.get('/', auth, taskController.getTasks);

router.post(
  '/',
  auth,
  validateRequest(createTaskValidationRules),
  taskController.addTask
);

export default router;
