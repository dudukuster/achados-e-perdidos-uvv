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

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: Location;
  lostDate: string;
  photoUrl: string;
  status: Status;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  itemId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SearchFilters {
  category?: Category;
  location?: Location;
  status?: Status;
  search?: string;
}

export const categoryLabels: Record<Category, string> = {
  [Category.ELETRONICOS]: 'Eletrônicos',
  [Category.DOCUMENTOS]: 'Documentos',
  [Category.ACESSORIOS]: 'Acessórios',
  [Category.MATERIAIS_ESCOLARES]: 'Materiais Escolares',
  [Category.OUTROS]: 'Outros',
};

export const locationLabels: Record<Location, string> = {
  [Location.BIBLIOTECA]: 'Biblioteca',
  [Location.LABORATORIOS]: 'Laboratórios',
  [Location.CANTINA]: 'Cantina',
  [Location.SALAS_DE_AULA]: 'Salas de Aula',
  [Location.AREAS_COMUNS]: 'Áreas Comuns',
};
