import { Request, Response, NextFunction } from 'express';
import { IPasswordResetTokenRepository } from '../repositories/IPasswordResetTokenRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailService } from '../services/IEmailService';
import { RegisterUser } from '../../usecases/RegisterUser';
import { LoginUser } from '../../usecases/LoginUser';
import { RecoverPassword } from '../../usecases/RecoverPassword';
import { ResetPassword } from '../../usecases/ResetPassword';
import { success } from '../../types/api';

export class AuthController {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetTokenRepository: IPasswordResetTokenRepository,
    private emailService: IEmailService,
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new RegisterUser(this.userRepository);
      const user = await useCase.execute(req.body);
      res.status(201).json(success(user));
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new LoginUser(this.userRepository);
      const result = await useCase.execute(req.body);
      res.status(200).json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async recoverPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new RecoverPassword(
        this.userRepository,
        this.passwordResetTokenRepository,
        this.emailService,
      );
      await useCase.execute(req.body);
      res.status(200).json(success({ message: 'Se o e-mail existir, um link de recuperacao sera enviado.' }));
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new ResetPassword(this.userRepository, this.passwordResetTokenRepository);
      await useCase.execute(req.body);
      res.status(200).json(success({ message: 'Senha atualizada com sucesso.' }));
    } catch (err) {
      next(err);
    }
  }
}
