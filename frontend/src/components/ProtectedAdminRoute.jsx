import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedAdminRoute({ children }) {
  const {isAdmin, handleLogout} = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <div className="text-5xl">🚫</div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Acceso solo para administradores
          </h1>
          <p className="text-slate-600">
            Esta página está reservada para el equipo administrador. Si necesitas
            revisar tu avance académico, vuelve a la vista principal.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => navigate("/home", { replace: true })}
              className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition-colors"
            >
              Ir a mi planificación
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-lg border border-slate-300 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
