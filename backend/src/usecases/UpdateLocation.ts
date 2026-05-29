import { ILocationRepository } from '../adapters/repositories/ILocationRepository';
import { Location } from '../entities/Location';
import { NotFoundError } from '../shared/errors/AppError';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export class UpdateLocation {
  constructor(private repo: ILocationRepository) {}
  async execute(id: string, data: { name?: string }): Promise<Location> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Local não encontrado.');
    const updateData: { name?: string; slug?: string } = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = generateSlug(data.name);
    }
    return this.repo.update(id, updateData);
  }
}
