export interface ItemImage {
  id: string;
  url: string;
  position: number;
  itemId: string;
  createdAt: Date;
}

export enum Status {
  PERDIDO = 'PERDIDO',
  ENCONTRADO = 'ENCONTRADO',
}

export interface Item {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  locationId: string;
  lostDate: Date;
  status: Status;
  userId: string;
  images: ItemImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemData {
  title: string;
  description: string;
  categoryId: string;
  locationId: string;
  lostDate: Date;
  userId: string;
  images: string[];
}

export type UpdateItemData = Partial<{
  title: string;
  description: string;
  categoryId: string;
  locationId: string;
  lostDate: Date;
  status: Status;
  images: string[];
}>;

export interface SearchFilters {
  categoryId?: string;
  locationId?: string;
  status?: Status;
  search?: string;
}
