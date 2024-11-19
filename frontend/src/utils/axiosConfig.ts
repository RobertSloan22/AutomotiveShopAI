import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    // Add your authorization header here
    'Authorization': `Bearer ${localStorage.getItem('token')}` // or however you store your auth token
  }
});

export default axiosInstance;