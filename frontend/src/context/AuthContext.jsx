import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hb_admin_token");
    if (token) {
      adminAPI.getMe()
        .then(res => setAdmin(res.data.data))
        .catch(() => localStorage.removeItem("hb_admin_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await adminAPI.login({ email, password });
    localStorage.setItem("hb_admin_token", res.data.token);
    setAdmin(res.data.admin);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("hb_admin_token");
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};