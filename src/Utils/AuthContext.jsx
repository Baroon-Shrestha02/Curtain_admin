import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../Services/AuthApi";

/**
 * Auth context: holds current user + token, exposes login/logout.
 * On mount, if a token exists it verifies it via /auth/logged-user.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until bootstrap resolves

  // Bootstrap: validate existing token and hydrate the user.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const u = await authService.getLoggedUser();
        setUser(u);
      } catch {
        // token invalid/expired
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res.user; // caller can branch on role
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
