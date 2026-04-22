export interface ItemImage {
  id: string;
  url: string;
  position: number;
  itemId: string;
  createdAt: Date;
}

export enum Category {
  ELETRONICOS = 'ELETRONICOS',
  DOCUMENTOS = 'DOCUMENTOS',
  ACESSORIOS = 'ACESSORIOS',
  MATERIAIS_ESCOLARES = 'MATERIAIS_ESCOLARES',
  OUTROS = 'OUTROS',
}

export enum Location {
  BIBLIOTECA = 'BIBLIOTECA',
  LABORATORIOS = 'LABORATORIOS',
  CANTINA = 'CANTINA',
  SALAS_DE_AULA = 'SALAS_DE_AULA',
  AREAS_COMUNS = 'AREAS_COMUNS',
}

export enum Status {
  PERDIDO = 'PERDIDO',
  ENCONTRADO = 'ENCONTRADO',
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: Location;
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
  category: Category;
  location: Location;
  lostDate: Date;
  userId: string;
  images: string[];
}

export type UpdateItemData = Partial<{
  title: string;
  description: string;
  category: Category;
  location: Location;
  lostDate: Date;
  status: Status;
  images: string[];
}>;

export interface SearchFilters {
  category?: Category;
  location?: Location;
  status?: Status;
  search?: string;
}
