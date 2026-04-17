import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// INTERCEPTOR: Before every single request goes out, run this function!
instance.interceptors.request.use((config) => {
    // 1. Dig into Local Storage to find our VIP Pass
    const token = localStorage.getItem('token');
    
    // 2. If we have one, glue it to the 'Authorization' Header of the outgoing request!
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // standard convention
    }
    
    // 3. Send it on its way!
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;
