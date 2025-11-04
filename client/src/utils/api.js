import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localdevhub-2.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ CORRECTED: All endpoints now have /api prefix
// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (userData) => api.put('/api/auth/profile', userData),
  changePassword: (passwordData) => api.put('/api/auth/change-password', passwordData),
};

// Projects API
export const projectsAPI = {
  getAll: (params = {}) => api.get('/api/projects', { params }),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (projectData) => api.post('/api/projects', projectData),
  update: (id, projectData) => api.put(`/api/projects/${id}`, projectData),
  delete: (id) => api.delete(`/api/projects/${id}`),
  apply: (id, applicationData) => api.post(`/api/projects/${id}/apply`, applicationData),
  getApplications: (id) => api.get(`/api/projects/${id}/applications`),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
  getDevelopers: (params = {}) => api.get('/api/users/developers', { params }),
  getClients: (params = {}) => api.get('/api/users/clients', { params }),
};

// Messages API
export const messagesAPI = {
  getAll: (params = {}) => api.get('/api/messages', { params }),
  getById: (id) => api.get(`/api/messages/${id}`),
  create: (messageData) => api.post('/api/messages', messageData),
  update: (id, messageData) => api.put(`/api/messages/${id}`, messageData),
  delete: (id) => api.delete(`/api/messages/${id}`),
  markAsRead: (id) => api.put(`/api/messages/${id}/read`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getRecentActivity: () => api.get('/api/dashboard/activity'),
  getMyProjects: () => api.get('/api/dashboard/my-projects'),
  getMyApplications: () => api.get('/api/dashboard/my-applications'),
};

export default api;