import { Request, Response, NextFunction } from 'express';
import { IUserRepository } from '../repositories/IUserRepository';
import { RegisterUser } from '../../usecases/RegisterUser';
import { LoginUser } from '../../usecases/LoginUser';
import { RecoverPassword } from '../../usecases/RecoverPassword';
import { success } from '../../types/api';

export class AuthController {
  constructor(private userRepository: IUserRepository) {}

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
      const useCase = new RecoverPassword(this.userRepository);
      await useCase.execute(req.body);
      res.status(200).json(success({ message: 'Se o e-mail existir, um link de recuperação será enviado.' }));
    } catch (err) {
      next(err);
    }
  }
}
