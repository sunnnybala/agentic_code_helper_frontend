import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await AuthAPI.me();
      if (res.success) setUser(res.user);
    } catch (error) {
      // Only log error if it's not a 401 (which is expected when not logged in)
      if (error.response?.status !== 401) {
        console.error('Auth refresh failed:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const doRefresh = async () => {
      try {
        const res = await AuthAPI.me();
        if (isMounted && res.success) setUser(res.user);
      } catch (error) {
        if (isMounted && error.response?.status !== 401) {
          console.error('Auth refresh failed:', error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    doRefresh();

    return () => { isMounted = false; };
  }, []);

  const login = async (username, password) => {
    try {
      const res = await AuthAPI.login({ username, password });
      if (res.success) setUser(res.user);
      return res;
    } catch (err) {
      const error = err.response?.data?.error || err.response?.data?.details || err.message || 'Login failed';
      return { success: false, error };
    }
  };

  const register = async (username, password, email) => {
    try {
      const res = await AuthAPI.register({ username, password, email });
      if (res.success) setUser(res.user);
      return res;
    } catch (err) {
      const error = err.response?.data?.error || err.response?.data?.details || err.message || 'Registration failed';
      return { success: false, error };
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await AuthAPI.loginWithGoogle(idToken);
      if (res.success) setUser(res.user);
      return res;
    } catch (err) {
      const error = err.response?.data?.error || err.response?.data?.details || err.message || 'Login failed';
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
    }
  };

  // Expose refresh so callers can refresh user (e.g., after purchases or processing)
  const refreshWrapper = async () => {
    try {
      const res = await AuthAPI.me();
      if (res.success) setUser(res.user);
    } catch (e) {
      // swallow
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refresh: refreshWrapper }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


