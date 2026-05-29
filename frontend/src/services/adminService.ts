import api from './api'

export const adminService = {
  listUsers: () => api.get('/admin/users').then(r => r.data),
  updateUserRole: (userId: string, role: 'USER' | 'ADMIN') =>
    api.patch(`/admin/users/${userId}/role`, { role }).then(r => r.data),
  createCategory: (data: { name: string }) =>
    api.post('/admin/categories', data).then(r => r.data),
  updateCategory: (id: string, data: { name: string }) =>
    api.put(`/admin/categories/${id}`, data).then(r => r.data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  createLocation: (data: { name: string }) =>
    api.post('/admin/locations', data).then(r => r.data),
  updateLocation: (id: string, data: { name: string }) =>
    api.put(`/admin/locations/${id}`, data).then(r => r.data),
  deleteLocation: (id: string) => api.delete(`/admin/locations/${id}`),
  deleteItem: (id: string) => api.delete(`/admin/items/${id}`),
  deleteComment: (id: string) => api.delete(`/admin/comments/${id}`),
}
