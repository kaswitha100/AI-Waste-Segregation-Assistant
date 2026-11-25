import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('waste_ai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('waste_ai_token')) {
        localStorage.removeItem('waste_ai_token');
        localStorage.removeItem('waste_ai_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (full_name, email, password) => api.post('/auth/register', { full_name, email, password }),
  getMe: () => api.get('/auth/me'),
};

// Classification Endpoints
export const classifyAPI = {
  uploadImage: (formData, notes) => {
    return api.post(`/classify/upload${notes ? `?notes=${encodeURIComponent(notes)}` : ''}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  cameraCapture: (imageBase64, notes) => {
    return api.post('/classify/camera', { image_base64: imageBase64, notes });
  },
  getGuide: () => api.get('/classify/guide'),
};

// History Endpoints
export const historyAPI = {
  getHistory: (params) => api.get('/history', { params }),
  getDetail: (id) => api.get(`/history/${id}`),
  submitFeedback: (id, feedback, userCorrection) => api.post(`/history/${id}/feedback`, { feedback, user_correction: userCorrection }),
  deleteItem: (id) => api.delete(`/history/${id}`),
};

// Analytics Endpoints
export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
};

// User Profile Endpoints
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (old_password, new_password) => api.post('/profile/change-password', { old_password, new_password }),
};

// Admin Endpoints
export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllClassifications: (params) => api.get('/admin/classifications', { params }),
};

export default api;
