import api from '../../api/core/api.core';
import { safeRequest } from '../utils/apiUtils';
import { Event } from '../types';

export const eventService = {
  getAll: () => safeRequest<Event[]>(() => api.get('/events/')),
  register: (id: string) => safeRequest<void>(() => api.post(`/events/${id}/register/`)),
};