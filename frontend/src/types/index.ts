export type Role = 'USER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Location {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Item {
  id: string
  title: string
  description: string
  categoryId: string
  locationId: string
  category: { id: string; name: string; slug: string }
  location: { id: string; name: string; slug: string }
  lostDate: string
  status: Status
  userId: string
  user?: { id: string; name: string; email: string }
  images: ItemImage[]
  createdAt: string
  updatedAt: string
}

export interface ItemImage {
  id: string
  url: string
  position: number
  itemId: string
  createdAt: string
}

export enum Status {
  PERDIDO = 'PERDIDO',
  ENCONTRADO = 'ENCONTRADO',
}

export interface Comment {
  id: string
  text: string
  itemId: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  categoryId?: string
  locationId?: string
  status?: Status
  search?: string
}

export const statusLabels: Record<Status, string> = {
  [Status.PERDIDO]: 'Perdido',
  [Status.ENCONTRADO]: 'Encontrado',
}
