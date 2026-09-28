import React, { createContext, useState, useEffect } from 'react';

const STORAGE_KEYS = {
  users: 'library_users',
  currentUser: 'library_current_user',
};

const defaultUsers = [
  { id: 'admin-1', name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
];

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStorage(STORAGE_KEYS.currentUser, null));

  useEffect(() => {
    const existingUsers = readStorage(STORAGE_KEYS.users, defaultUsers);
    if (!existingUsers || existingUsers.length === 0) {
      writeStorage(STORAGE_KEYS.users, defaultUsers);
    }
  }, []);

  useEffect(() => {
    if (user) {
      writeStorage(STORAGE_KEYS.currentUser, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.currentUser);
    }
  }, [user]);

  const login = async (email, password) => {
    const users = readStorage(STORAGE_KEYS.users, defaultUsers);
    const foundUser = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const safeUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role || 'user',
    };

    setUser(safeUser);
    return safeUser;
  };

  const register = async (name, email, password) => {
    const users = readStorage(STORAGE_KEYS.users, defaultUsers);
    const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
    };

    const updatedUsers = [...users, newUser];
    writeStorage(STORAGE_KEYS.users, updatedUsers);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
