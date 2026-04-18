import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// If backend returns 401, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Not logged in — redirect to Google OAuth
      window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    }
    return Promise.reject(error);
  }
);

export const BACKEND_URL = API_BASE_URL;
export default api;