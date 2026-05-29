import { ILocationRepository } from '../adapters/repositories/ILocationRepository';
import { Location } from '../entities/Location';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export class CreateLocation {
  constructor(private repo: ILocationRepository) {}
  async execute(data: { name: string }): Promise<Location> {
    const slug = generateSlug(data.name);
    return this.repo.create({ name: data.name, slug });
  }
}
