import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUp = (username: string, email: string, password: string) => {
  return api.post('/signup', { username, email, password });
};

export const login = (username: string, password: string) => {
  return api.post('/login', { username, password });
};

export const getProducts = () => {
  return api.get('/products');
};

export const addProduct = (productData: any) => {
  return api.post('/products', productData);
};

export const updateProduct = (id: string, productData: any) => {
  return api.put(`/products/${id}`, productData);
};

export const deleteProduct = (id: string) => {
  return api.delete(`/products/${id}`);
};

export default api;

