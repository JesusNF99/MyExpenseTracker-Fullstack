import api from './apiClient';
import { User } from '../types/schemas';

export const authService = {
    async login(credentials: User) {
        const response = await api.post('/api/auth/login', credentials);

        // Try to find the token in common fields
        const token = response.data.token || response.data.jwt || response.data.accessToken || (typeof response.data === 'string' ? response.data : null);

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('username', credentials.username);
            // Ensure any sequential calls see the change immediately
            api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('Login successful but no token found in response. Expected field "token", "jwt", or "accessToken".');
        }
        return response.data;
    },

    async signup(userData: User) {
        const response = await api.post('/api/auth/signup', userData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
    },

    getUsername() {
        return localStorage.getItem('username') || 'User';
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};
