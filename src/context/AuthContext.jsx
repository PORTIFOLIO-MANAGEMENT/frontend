/* eslint-disable react-refresh/only-export-components -- provider + its useAuth hook are intentionally co-located */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { tokenStore } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data ?? data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // One-time auth bootstrap on mount: sync React with the persisted token +
    // the API (an external system), exactly the case effects exist for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMe();
    const onUnauthorized = () => setUser(null);
    window.addEventListener("pm:unauthorized", onUnauthorized);
    return () => window.removeEventListener("pm:unauthorized", onUnauthorized);
  }, [loadMe]);

  const persistSession = (token, nextUser) => {
    tokenStore.set(token);
    setUser(nextUser);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data.token, data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data.token, data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* token may already be invalid — clear locally regardless */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    refresh: loadMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
