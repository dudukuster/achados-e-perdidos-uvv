import { Router } from 'express';
import { CommentController } from '../../../adapters/controllers/CommentController';
import { authMiddleware } from '../../../adapters/middlewares/authMiddleware';
import { validate } from '../../../adapters/middlewares/validateMiddleware';
import { createCommentSchema, updateCommentSchema } from '../../../adapters/validators/commentSchemas';

export default function commentRoutes(controller: CommentController): Router {
  const router = Router({ mergeParams: true });

  router.use(authMiddleware);

  router.post('/', validate(createCommentSchema), (req, res, next) => controller.create(req, res, next));
  router.get('/', (req, res, next) => controller.getByItem(req, res, next));

  return router;
}

export function commentCrudRoutes(controller: CommentController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.patch('/:id', validate(updateCommentSchema), (req, res, next) => controller.update(req, res, next));
  router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

  return router;
}
