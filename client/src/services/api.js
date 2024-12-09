import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the Authorization header dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    console.log('Request config:', config); // Debugging log
    return config;
  },
  (error) => {
    console.error('Request error:', error); // Debugging log
    return Promise.reject(error);
  }
);

// Authentication API calls
export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Bookshelf API calls
export const addToShelf = async (bookData) => {
  const response = await api.post('/api/bookshelf', bookData);
  return response.data;
};

export const fetchUserBooks = async () => {
  const response = await api.get('/api/bookshelf');
  return response.data;
};

export const removeFromShelf = async (bookId) => {
  const response = await api.delete(`/api/bookshelf/${bookId}`);
  return response.data;
};

export default api;

// recommendation calls
export const getRecommendations = async (books, numRecommendations = 30) => {
  const response = await api.post('/recommendations/multiple', {
    books,
    num_recommendations: numRecommendations,
  });
  return response.data;
};
