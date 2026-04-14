import axios from 'axios';

// ✅ CORRECT: No quotes, using import.meta.env
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE_URL 
});
// Automatically attach the JWT token to every request if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;