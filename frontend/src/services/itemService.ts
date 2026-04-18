import api from './api';
import { Category, Item, Location, SearchFilters, Status } from '../types';

interface CreateItemData {
  title: string;
  description: string;
  category: string;
  location: string;
  lostDate: string;
  photoUrl: string;
}

export interface UpdateItemData {
  title?: string;
  description?: string;
  category?: Category;
  location?: Location;
  lostDate?: string;
  photoUrl?: string;
  status?: Status;
}

export const itemService = {
  async create(data: CreateItemData): Promise<Item> {
    const response = await api.post('/items', data);
    return response.data;
  },

  async search(filters: SearchFilters): Promise<Item[]> {
    const response = await api.get('/items', { params: filters });
    return response.data;
  },

  async getById(id: string): Promise<Item> {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async getMyItems(): Promise<Item[]> {
    const response = await api.get('/items/my-items');
    return response.data;
  },

  async update(id: string, data: UpdateItemData): Promise<Item> {
    const response = await api.patch(`/items/${id}`, data);
    return response.data;
  },
};
