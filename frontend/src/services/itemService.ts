import api from './api'
import { Item, SearchFilters, Status } from '../types'

interface CreateItemData {
  title: string
  description: string
  categoryId: string
  locationId: string
  lostDate: string
  images: string[]
}

export interface UpdateItemData {
  title?: string
  description?: string
  categoryId?: string
  locationId?: string
  lostDate?: string
  status?: Status
  images?: string[]
}

export const itemService = {
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))

    const response = await api.post('/items/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.images
  },

  async create(data: CreateItemData): Promise<Item> {
    const response = await api.post('/items', data)
    return response.data
  },

  async search(filters?: SearchFilters): Promise<Item[]> {
    const response = await api.get('/items', { params: filters })
    return response.data
  },

  async getById(id: string): Promise<Item> {
    const response = await api.get(`/items/${id}`)
    return response.data
  },

  async getMyItems(): Promise<Item[]> {
    const response = await api.get('/items/my-items')
    return response.data
  },

  async update(id: string, data: UpdateItemData): Promise<Item> {
    const response = await api.patch(`/items/${id}`, data)
    return response.data
  },
}
