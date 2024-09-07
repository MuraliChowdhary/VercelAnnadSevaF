import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if there is a token in local storage
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/login', { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setUser(response.data))
                .catch(() => localStorage.removeItem('token')); // Remove invalid token
        }
    }, []);

    const login = async (credentials) => {
        const response = await axios.post('/api/auth/login', credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
