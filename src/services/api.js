import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  withCredentials: true
});

export const AuthAPI = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  loginWithGoogle: (idToken) => api.post('/auth/google', { idToken }).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data)
};

export const PaymentsAPI = {
  createOrder: (credits) => api.post('/payments/create-order', { credits }).then(r => r.data),
  verify: (payload) => api.post('/payments/verify', payload).then(r => r.data)
};

export default api;


