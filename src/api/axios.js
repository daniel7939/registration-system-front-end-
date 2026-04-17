import axios from 'axios';

// Detect if we are running in production or development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
    baseURL: API_BASE_URL
});

// INTERCEPTOR: Before every single request goes out, run this function!
instance.interceptors.request.use((config) => {
    // 1. Dig into Local Storage to find our VIP Pass
    const token = localStorage.getItem('token');
    
    // 2. If we have one, glue it to the 'Authorization' Header of the outgoing request!
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; 
    }
    
    // 3. Send it on its way!
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;
