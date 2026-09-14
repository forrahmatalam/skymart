import { createContext, useContext, useEffect, useState } from "react";
import {
  clearCurrentUser,
  createUser,
  findUserByEmail,
  getStoredCurrentUser,
  setCurrentUser as persistCurrentUser,
  updateStoredUser,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredCurrentUser();
    setCurrentUser(storedUser);
    setLoading(false);
  }, []);

  async function register({ name, email, password }) {
    const existingUser = findUserByEmail(email);

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = createUser({ name, email, password });
    persistCurrentUser(newUser);
    setCurrentUser(newUser);

    return newUser;
  }

  async function login({ email, password }) {
    const existingUser = findUserByEmail(email);

    if (!existingUser || existingUser.password !== password) {
      throw new Error("Invalid email or password.");
    }

    persistCurrentUser(existingUser);
    setCurrentUser(existingUser);

    return existingUser;
  }

  function logout() {
    clearCurrentUser();
    setCurrentUser(null);
  }

  function updateProfile(updates) {
    if (!currentUser) {
      return;
    }

    if (updates.email && updates.email.toLowerCase() !== currentUser.email) {
      const conflictingUser = findUserByEmail(updates.email);
      if (conflictingUser) {
        throw new Error("This email is already in use by another account.");
      }
    }

    const updatedUser = updateStoredUser(currentUser.id, updates);
    persistCurrentUser(updatedUser);
    setCurrentUser(updatedUser);

    return updatedUser;
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
