import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const existingToken = localStorage.getItem('token');
  const [token, setToken] = useState(existingToken);
  const [userId, setUserId] = useState(null);

  const saveToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    fetchUserId(token); // Fetch user details after saving the token
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserId(null);
  };

  const fetchUserId = async (token) => {
    try {
      const res = await axios.get('/auth/user', { // Relative URL
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User details fetched:', res.data);
      setUserId(res.data.id);
    } catch (error) {
      console.error('Error fetching user ID:', error.response?.data || error.message);
      setUserId(null);
    }
  };

  useEffect(() => {
    if (token) {

      console.log('Token exists:', token); // Debugging the token

      fetchUserId(token); // Automatically fetch user details on load
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, userId, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
