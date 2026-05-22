import express from 'express';
import cors from 'cors';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaItemRepository } from '../repositories/PrismaItemRepository';
import { PrismaCommentRepository } from '../repositories/PrismaCommentRepository';
import { PrismaPasswordResetTokenRepository } from '../repositories/PrismaPasswordResetTokenRepository';
import { PrismaCategoryRepository } from '../repositories/PrismaCategoryRepository';
import { PrismaLocationRepository } from '../repositories/PrismaLocationRepository';
import { AuthController } from '../../adapters/controllers/AuthController';
import { ItemController } from '../../adapters/controllers/ItemController';
import { CommentController } from '../../adapters/controllers/CommentController';
import { AdminController } from '../../adapters/controllers/AdminController';
import { ConsoleEmailService } from '../services/ConsoleEmailService';
import { NodemailerEmailService } from '../services/NodemailerEmailService';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import commentRoutes, { commentCrudRoutes } from './routes/commentRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { ListCategories } from '../../usecases/ListCategories';
import { ListLocations } from '../../usecases/ListLocations';
import { success } from '../../types/api';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Composition Root
const userRepository = new PrismaUserRepository();
const itemRepository = new PrismaItemRepository();
const commentRepository = new PrismaCommentRepository();
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository();
const categoryRepository = new PrismaCategoryRepository();
const locationRepository = new PrismaLocationRepository();

const emailService = process.env['SMTP_HOST'] ? new NodemailerEmailService() : new ConsoleEmailService();

const authController = new AuthController(
  userRepository,
  passwordResetTokenRepository,
  emailService,
);
const itemController = new ItemController(itemRepository);
const commentController = new CommentController(commentRepository, itemRepository);
const adminController = new AdminController(
  userRepository,
  categoryRepository,
  locationRepository,
  itemRepository,
  commentRepository,
);

app.use('/auth', authRoutes(authController));
app.use('/items', itemRoutes(itemController));
app.use('/items/:itemId/comments', commentRoutes(commentController));
app.use('/comments', commentCrudRoutes(commentController));
app.use('/admin', adminRoutes(adminController));

app.get('/categories', async (_req, res, next) => {
  try {
    const cats = await new ListCategories(categoryRepository).execute();
    res.json(success(cats));
  } catch (err) { next(err); }
});

app.get('/locations', async (_req, res, next) => {
  try {
    const locs = await new ListLocations(locationRepository).execute();
    res.json(success(locs));
  } catch (err) { next(err); }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
