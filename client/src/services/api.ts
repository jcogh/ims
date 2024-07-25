import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', (error as AxiosError).response?.data || (error as Error).message);
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', (error as AxiosError).response?.data || (error as Error).message);
    throw error;
  }
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
