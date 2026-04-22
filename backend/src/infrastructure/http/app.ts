import express from 'express';
import cors from 'cors';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaItemRepository } from '../repositories/PrismaItemRepository';
import { PrismaCommentRepository } from '../repositories/PrismaCommentRepository';
import { PrismaPasswordResetTokenRepository } from '../repositories/PrismaPasswordResetTokenRepository';
import { AuthController } from '../../adapters/controllers/AuthController';
import { ItemController } from '../../adapters/controllers/ItemController';
import { CommentController } from '../../adapters/controllers/CommentController';
import { ConsoleEmailService } from '../services/ConsoleEmailService';
import { NodemailerEmailService } from '../services/NodemailerEmailService';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import commentRoutes, { commentCrudRoutes } from './routes/commentRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Composition Root
const userRepository = new PrismaUserRepository();
const itemRepository = new PrismaItemRepository();
const commentRepository = new PrismaCommentRepository();
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository();

const emailService = process.env['SMTP_HOST'] ? new NodemailerEmailService() : new ConsoleEmailService();

const authController = new AuthController(
  userRepository,
  passwordResetTokenRepository,
  emailService,
);
const itemController = new ItemController(itemRepository);
const commentController = new CommentController(commentRepository, itemRepository);

app.use('/auth', authRoutes(authController));
app.use('/items', itemRoutes(itemController));
app.use('/items/:itemId/comments', commentRoutes(commentController));
app.use('/comments', commentCrudRoutes(commentController));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
