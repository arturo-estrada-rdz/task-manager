import { Router } from 'express';
import { validateRequest } from '../../middleware/validation';
import auth from '../../middleware/verify-token';
import { taskController } from './task.controller';
import {
  patchStatusValidationRules,
  taskInputValidationRules,
} from './task.validators';

const router = Router();

router.post(
  '/',
  auth,
  validateRequest(taskInputValidationRules),
  taskController.addTask
);

router.get('/', auth, taskController.getTasks);

router.get('/:id', auth, taskController.getTask);

router.put(
  '/:id',
  auth,
  validateRequest(taskInputValidationRules),
  taskController.updateTask
);

router.patch(
  '/:id',
  auth,
  validateRequest(patchStatusValidationRules),
  taskController.patchTaskStatus
);

router.delete('/:id', auth, taskController.deleteTask);

export default router;
