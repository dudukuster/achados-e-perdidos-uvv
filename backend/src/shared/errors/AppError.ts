export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(msg = 'Recurso não encontrado.') {
    super(msg, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(msg = 'Acesso negado.') {
    super(msg, 403);
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg = 'Não autenticado.') {
    super(msg, 401);
  }
}

export class ConflictError extends AppError {
  constructor(msg = 'Conflito.') {
    super(msg, 409);
  }
}
