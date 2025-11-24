import { useNavigate } from 'react-router-dom';
import { useCallback } from "react";

export const useAuth = () => {
  const navigate = useNavigate();

  // Obtener datos del localStorage
  const getToken = useCallback(() => localStorage.getItem("token"), []);
  const getRol = useCallback(() => localStorage.getItem("rol"), []);
  const isAdmin = useCallback(() => localStorage.getItem("isAdmin") === "true", []);
  
  
  const getHeaderToken = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }
  }, [])

  const setToken = useCallback(({ admin, token, rol }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", admin ? "true" : "false");

    if (rol) localStorage.setItem("rol", rol);
    else localStorage.removeItem("rol");
  }, []);

  // Logout centralizado
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("isAdmin");
    navigate("/");
  }, [navigate]);

  return { getToken, getRol, isAdmin, handleLogout, setToken, getHeaderToken};
};