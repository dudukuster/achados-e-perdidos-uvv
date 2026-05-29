import { Location, CreateLocationData, UpdateLocationData } from '../../entities/Location';

export interface ILocationRepository {
  create(data: CreateLocationData): Promise<Location>;
  findById(id: string): Promise<Location | null>;
  findAll(): Promise<Location[]>;
  update(id: string, data: UpdateLocationData): Promise<Location>;
  delete(id: string): Promise<void>;
  hasItems(locationId: string): Promise<boolean>;
}
