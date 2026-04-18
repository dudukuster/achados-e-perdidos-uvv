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
  photoUrl: string;
  status: Status;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateItemData = Omit<Item, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateItemData = Partial<Pick<Item, 'title' | 'description' | 'category' | 'location' | 'lostDate' | 'photoUrl' | 'status'>>;

export interface SearchFilters {
  category?: Category;
  location?: Location;
  status?: Status;
  search?: string;
}
