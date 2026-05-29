import { Router } from 'express';
import { ItemController } from '../../../adapters/controllers/ItemController';
import { authMiddleware } from '../../../adapters/middlewares/authMiddleware';
import { uploadItemImages } from '../../../adapters/middlewares/uploadItemImages';
import { validate } from '../../../adapters/middlewares/validateMiddleware';
import {
  createItemSchema,
  updateItemSchema,
} from '../../../adapters/validators/itemSchemas';

export default function itemRoutes(controller: ItemController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post('/images/upload', uploadItemImages, (req, res, next) => controller.uploadImages(req, res, next));
  router.post('/', validate(createItemSchema), (req, res, next) => controller.create(req, res, next));
  router.get('/', (req, res, next) => controller.search(req, res, next));
  router.get('/my-items', (req, res, next) => controller.getMyItems(req, res, next));
  router.get('/:id', (req, res, next) => controller.getById(req, res, next));
  router.patch('/:id', validate(updateItemSchema), (req, res, next) => controller.update(req, res, next));
  router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

  return router;
}
