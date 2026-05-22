import { ILocationRepository } from '../adapters/repositories/ILocationRepository';
import { NotFoundError, BadRequestError } from '../shared/errors/AppError';

export class DeleteLocation {
  constructor(private repo: ILocationRepository) {}
  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Local não encontrado.');
    if (await this.repo.hasItems(id)) {
      throw new BadRequestError('Não é possível excluir local com itens vinculados.');
    }
    await this.repo.delete(id);
  }
}
