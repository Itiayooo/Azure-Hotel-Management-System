import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const API = 'https://azure-hotel-management-system.onrender.com/api';

// Same rule as the server: holding the permission on the right also gives you the one on the left
const IMPLIED_BY = {
  'bookings.view': ['bookings.manage'],
  'rooms.status': ['rooms.manage'],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem('azure_user');
    localStorage.removeItem('azure_token');
    setUser(null);
  };

  // Pulls the latest role and permissions from the server, so changes made by the
  // super admin show up without logging out. A deactivated account is signed out here.
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('azure_token');
    if (!token) return;

    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        clearSession();
        return;
      }
      if (!res.ok) return;

      const fresh = await res.json();
      localStorage.setItem('azure_user', JSON.stringify(fresh));
      setUser(fresh);
    } catch (err) {
      // offline or server asleep: keep the current session
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('azure_user');
    const token = localStorage.getItem('azure_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      refreshUser(); // runs in the background so the page doesn't wait for it
    }
    setLoading(false);
  }, [refreshUser]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshUser();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshUser]);

  const login = (userData, token) => {
    localStorage.setItem('azure_user', JSON.stringify(userData));
    localStorage.setItem('azure_token', token);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('azure_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'superadmin') return true;
    if (user.role !== 'staff') return false;

    const owned = user.permissions || [];
    if (owned.includes(permission)) return true;
    return (IMPLIED_BY[permission] || []).some((p) => owned.includes(p));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, hasPermission, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);