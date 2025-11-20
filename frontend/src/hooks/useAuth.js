import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  // Obtener datos del localStorage
  const getToken = () => localStorage.getItem("token");
  const getRol = () => localStorage.getItem("rol");
  const isAdmin = () => localStorage.getItem("isAdmin") === "true";

  const setToken = ({admin, token, rol}) => {
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', admin ? 'true' : 'false');
      if (rol) {
        localStorage.setItem('rol', rol);
      } else {
        localStorage.removeItem('rol');
      }
  }

  // Logout centralizado
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("isAdmin");
    navigate('/');
  };

  return { getToken, getRol, isAdmin, handleLogout, setToken };
};