import { Router } from 'express';
import { AuthController } from '../../../adapters/controllers/AuthController';
import { validate } from '../../../adapters/middlewares/validateMiddleware';
import {
  registerSchema,
  loginSchema,
  recoverPasswordSchema,
} from '../../../adapters/validators/authSchemas';

export default function authRoutes(controller: AuthController): Router {
  const router = Router();

  router.post('/register', validate(registerSchema), (req, res, next) => controller.register(req, res, next));
  router.post('/login', validate(loginSchema), (req, res, next) => controller.login(req, res, next));
  router.post('/recover-password', validate(recoverPasswordSchema), (req, res, next) =>
    controller.recoverPassword(req, res, next)
  );

  return router;
}
