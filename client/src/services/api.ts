import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = (username: string, email: string, password: string) => {
  return api.post('/register', { username, email, password });
};

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { error: 'An unexpected error occurred' };
  }
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

