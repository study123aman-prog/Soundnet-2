// =============================================
// client/src/context/AuthContext.js
// Global state for logged-in user
// =============================================

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create a context object
const AuthContext = createContext();

// Provider wraps the whole app to share user state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Current user info
  const [loading, setLoading] = useState(true); // While checking session

  // On app load, check if user is already logged in (via session)
  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null)) // Not logged in
      .finally(() => setLoading(false));
  }, []);

  // Login: saves user to context state
  const login = (userData) => {
    setUser(userData);
  };

  // Logout: clears session and state
  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
