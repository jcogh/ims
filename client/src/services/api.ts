import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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

export const register = (username: string, email: string, password: string) => {
  return api.post('/register', { username, email, password });
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const getProducts = async () => {
  return api.get('/products');
};

export const addProduct = async (productData: any) => {
  return api.post('/products', productData);
};

export const updateProduct = (id: string, productData: any) => {
  return api.put(`/products/${id}`, productData);
};

export const deleteProduct = (id: string) => {
  return api.delete(`/products/${id}`);
};

export default api;

