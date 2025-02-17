
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});


export const register = (userData) => api.post('/signup', userData);
export const login = (credentials) => api.post('/login', credentials);
export const getProfile = () => api.get('/profile');