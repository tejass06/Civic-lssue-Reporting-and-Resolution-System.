import axios from 'axios';

// IMPORTANT: Use your PC's IP address and the correct HTTP port
const API_URL = 'http:// /api';

const api = axios.create({
  baseURL: API_URL,
});

// This intercepts every request and automatically adds the security token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) => api.post('/Auth/login', { username, password });

// Issues
export const fetchReports = (issueTypes) => api.get('/Issues', { params: { types: issueTypes } });
export const updateIssueStatus = (id, newStatus) => api.put(`/Issues/${id}/status`, { status: newStatus });
export const assignWorkerToIssue = (id, workerName) => api.put(`/Issues/${id}/assign`, { workerName });

// Admin
export const getAllUsers = () => api.get('/Admin/users');
export const createUser = (userData) => api.post('/Admin/users', userData);
export const resetUserPassword = (userId, newPassword) => api.put(`/Admin/users/${userId}/reset-password`, { newPassword });

// Analytics
export const fetchStats = () => api.get('/Issues/stats');
export const getIssuesByDeptStats = () => api.get('/Admin/analytics/by-department');
export const getHeatmapData = () => api.get('/Admin/analytics/heatmap');

export default api;