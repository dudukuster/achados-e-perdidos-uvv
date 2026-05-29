export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export type CreateCategoryData = Pick<Category, 'name' | 'slug'>;
export type UpdateCategoryData = Partial<Pick<Category, 'name' | 'slug'>>;
