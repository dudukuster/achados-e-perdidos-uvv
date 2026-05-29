export interface Location {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export type CreateLocationData = Pick<Location, 'name' | 'slug'>;
export type UpdateLocationData = Partial<CreateLocationData>;
