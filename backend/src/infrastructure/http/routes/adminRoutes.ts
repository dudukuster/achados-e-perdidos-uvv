import { Router } from 'express';
import { AdminController } from '../../../adapters/controllers/AdminController';
import { authMiddleware } from '../../../adapters/middlewares/authMiddleware';
import { adminMiddleware } from '../../../adapters/middlewares/adminMiddleware';

export default function adminRoutes(controller: AdminController): Router {
  const router = Router();
  router.use(authMiddleware, adminMiddleware);

  router.get('/users', (req, res, next) => controller.listUsers(req, res, next));
  router.patch('/users/:id/role', (req, res, next) => controller.updateUserRole(req, res, next));
  router.post('/categories', (req, res, next) => controller.createCategory(req, res, next));
  router.put('/categories/:id', (req, res, next) => controller.updateCategory(req, res, next));
  router.delete('/categories/:id', (req, res, next) => controller.deleteCategory(req, res, next));
  router.post('/locations', (req, res, next) => controller.createLocation(req, res, next));
  router.put('/locations/:id', (req, res, next) => controller.updateLocation(req, res, next));
  router.delete('/locations/:id', (req, res, next) => controller.deleteLocation(req, res, next));
  router.delete('/items/:id', (req, res, next) => controller.deleteItem(req, res, next));
  router.delete('/comments/:id', (req, res, next) => controller.deleteComment(req, res, next));

  return router;
}
