import { ILocationRepository } from '../adapters/repositories/ILocationRepository';
import { Location } from '../entities/Location';

export class ListLocations {
  constructor(private repo: ILocationRepository) {}
  async execute(): Promise<Location[]> {
    return this.repo.findAll();
  }
}
