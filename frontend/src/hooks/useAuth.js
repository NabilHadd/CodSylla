import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../store/authSlice";
import { useCallback } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, rol, isAdmin } = useSelector(state => state.auth);

  const setToken = useCallback((data) => {
    dispatch(login(data));
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  const getHeaderToken = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }), [token]);

  return {
    token,
    rol,
    isAdmin,
    isAuthenticated: !!token,
    setToken,
    handleLogout,
    getHeaderToken,
  };
};
