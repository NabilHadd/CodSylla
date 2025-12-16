import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RestrictedAcces from "./Utils/RestrictedAcces";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return <RestrictedAcces error={'Debes Autenticarte'}/>;
  }

  return <Outlet />;
}
