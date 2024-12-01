import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Interceptor para adicionar o token JWT no cabeçalho Authorization
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Certifique-se de armazenar o token após o login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
