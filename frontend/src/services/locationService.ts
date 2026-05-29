import api from './api'

export const locationService = {
  list: () => api.get('/locations').then(r => r.data),
}
