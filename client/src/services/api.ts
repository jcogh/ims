import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/register', { username, email, password });
  return response.data;
};

export const getProducts = () => api.get('/products');

export const getProduct = (id: number) => api.get(`/products/${id}`);

export const addProduct = (productData: any) => api.post('/products', productData);

export const updateProduct = (id: number, productData: any) => api.put(`/products/${id}`, productData);

export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

export const getRecentProducts = () => api.get('/products/recent');

export const getInventorySummary = () => api.get('/inventory/summary');

export const getPrediction = (productId: number) => api.get(`/predict/${productId}`);

export default api;
