import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Utils/Loading";

function AdminHome() {
  const [auditLog, setAuditLog] = useState([]);
  const [ramos, setRamos] = useState([]);
  const [auditRamos, setAuditRamos] = useState([]);
  const [actualSem, setActualSem] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [accessDenied, setAccessDenied] = useState(false);
  const [filtroCarrera, setFiltroCarrera] = useState("");

  const navigate = useNavigate();

  const ramosFiltrados = filtroCarrera
  ? auditRamos.filter(
            (r) => r.carrera?.codigo === filtroCarrera
    )
  : auditRamos;

  // Lee el token y rol almacenado
  const token = localStorage.getItem("token");

  const isAdmin = useMemo(
    () => localStorage.getItem("isAdmin") === "true",
    []
  );

  const siguienteSem = (sem) => {
    const anio = Math.floor(sem / 100);
    let semNum = sem % 100;
    if (semNum === 10) return anio * 100 + 20; // pasar al segundo semestre normal
    else return (anio + 1) * 100 + 10; 
  };

  const formatSemestre = (sem) => {
    sem = String(sem)
    const year = sem.slice(0, 4);
    const code = sem.slice(4);
    switch (code) {
      case "10":
        return `Primer semestre ${year}`;
      case "20":
        return `Segundo semestre ${year}`;
      case "15":
        return `Verano ${year}`;
      case "25":
        return `Invierno ${year}`;
      default:
        return `Semestre desconocido ${year}`;
    }
  };

  
  // Tu función, en useCallback para deps del efecto
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token"); // <- EXACTO como pediste
    sessionStorage.removeItem("token"); // por si acaso
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("rol");
    if (axios?.defaults?.headers?.common) {
      delete axios.defaults.headers.common.Authorization;
    }
    navigate("/", { replace: true });
    // Fallback duro por si algo cachea
    setTimeout(() => {
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
    }, 0);
  }, [navigate]);



  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    let didCancel = false;
    const controller = new AbortController();

    const fetchData = async () => {
      try {

        setAccessDenied(false);
        const authHeaders = { Authorization: `Bearer ${token}` };

        const [auditRes, ramosRes, auditRamosRes, actualSemRes, carrerasRes] = await Promise.all([
          axios.get("http://localhost:3001/admin/audit-log", {
            headers: authHeaders,
            signal: controller.signal,
          }),
          axios.get("http://localhost:3001/admin/ramos", {
            headers: authHeaders,
            signal: controller.signal,
          }),axios.get("http://localhost:3001/admin/audit-ramos", {
            headers: authHeaders,
            signal: controller.signal,
          }),
            axios.get("http://localhost:3001/get-all/semestre", {
            headers: authHeaders,
            signal: controller.signal,
          }),
            axios.get("http://localhost:3001/get-all/carreras", {
            headers: authHeaders,
            signal: controller.signal,
          }),
        ]);

        if (!didCancel) {
          setAuditLog(auditRes.data);
          setRamos(ramosRes.data);
          setAuditRamos(auditRamosRes.data)
          setActualSem(actualSemRes.data)
          setCarreras(carrerasRes.data)
        }
      } catch (err) {
        const isCanceled =
          typeof err === "object" &&
          err !== null &&
          ("code" in err
            ? err.code === "ERR_CANCELED"
            : err?.name === "CanceledError");

        if (isCanceled) return;

        const status =
          typeof err === "object" && err !== null
            ? err?.response?.status
            : undefined;

        if (!didCancel && status === 401) {
          didCancel = true;
          handleLogout();
          return;
        }

        if (!didCancel && status === 403) {
          setAccessDenied(true);
          setError("No tienes permisos para acceder al panel de administración.");
          return;
        }

        if (!didCancel) {
          const fallbackMessage =
            (typeof err === "object" && err !== null && err?.response?.data?.message) ||
            (err instanceof Error ? err.message : "") ||
            "No se pudieron cargar los datos del administrador";
          setError(fallbackMessage);
        }
      } finally {
        if (!didCancel) {
          setLoading(false);
        }
      }
    };

    fetchData().catch((unexpectedError) => {
      if (didCancel) return;
      console.error("Fallo inesperado al cargar datos admin", unexpectedError);
      setError(
        unexpectedError instanceof Error
          ? unexpectedError.message
          : "Ocurrió un error inesperado al cargar el panel"
      );
      setLoading(false);
    });

    return () => {
      didCancel = true;
      controller.abort();
    };
  }, [token, handleLogout, reloadKey, isAdmin]);

  const refetch = useCallback(() => {
    setAccessDenied(false);
    setError("");
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  }, []);


  const auditLogRows = useMemo(
    () =>
      auditLog.map((log) => ({
        ...log,
        fechaFormateada: new Date(log.fecha).toLocaleString("es-CL", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      })),
    [auditLog]
  );

  // Pantalla de carga (mientras resolvemos si hay token o no)
  if (loading) {
    return (
      <Loading mensaje="Cargando panel administrador"/>
    );
  }

  // A PARTIR DE AQUÍ no rompemos la regla de hooks: el return es único,
  // y dentro decidimos si redirigimos o mostramos el panel.
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <div className="text-5xl">🔒</div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Acceso restringido
          </h1>
          <p className="text-slate-600">
            No podemos mostrar esta sección porque no has iniciado sesión. Vuelve
            al inicio e ingresa con tus credenciales para continuar.
          </p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  if (accessDenied) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            No pudimos cargar el panel
          </h1>
          <p className="text-slate-600">
            {error}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={refetch}
              className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-lg border border-slate-300 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white relative">
          {/* Botón hamburguesa (abre menú) */}
          <button
            aria-label="Abrir menú"
            className="fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-full p-3 shadow"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          {/* Overlay */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Menú lateral */}
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white shadow-lg transform transition-transform z-50
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold">Menú</h2>
              <button
                aria-label="Cerrar menú"
                className="text-white/80 hover:text-white text-2xl leading-none"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* ÚNICO botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 py-12 px-6 w-full">
            <div className="max-w-6xl mx-auto space-y-10">
              <header className="bg-white rounded-2xl shadow p-8 border border-slate-100">
                <h1 className="text-3xl font-bold text-slate-900">
                  Panel Administrador
                </h1>
                <p className="text-slate-500 mt-2">
                  Información de (
                  <span className="font-semibold">audit_log</span> y{" "}
                  <span className="font-semibold">ramo</span>).
                </p>
              </header>

              {/* Tabla Audit Ramos */}
              <section className="bg-white rounded-2xl shadow border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Conteo de alumnos por ramo {formatSemestre(siguienteSem(actualSem))}
                  </h2>

                  <div className="flex items-center gap-3">
                    <select
                      value={filtroCarrera}
                      onChange={(e) => setFiltroCarrera(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas las carreras</option>
                      {carreras.map((c) => (
                        <option key={c.codigo} value={c.codigo}>
                          {c.nombre || c.codigo}
                        </option>
                      ))}
                    </select>

                    <span className="text-sm font-medium text-slate-500">
                      {ramosFiltrados.length} ramos mostrados.
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-left text-sm text-slate-600 uppercase tracking-wide">
                        <th className="px-4 py-2">Código</th>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Carrera</th>
                        <th className="px-4 py-2">Alumnos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ramosFiltrados.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-6 text-center text-slate-500"
                          >
                            No hay datos de auditoría disponibles.
                          </td>
                        </tr>
                      ) : (
                        ramosFiltrados.map((ramo) => (
                          <tr
                            key={ramo.codigo_ramo}
                            className="border-b border-slate-100 text-sm text-slate-700"
                          >
                            <td className="px-4 py-3">{ramo.codigo_ramo}</td>
                            <td className="px-4 py-3">{String(ramo.nombre || "Sin nombre")}</td>
                            <td className="px-4 py-3">
                              {ramo.carrera?.nombre || ramo.carrera?.codigo || "Sin carrera"}
                            </td>
                            <td className="px-4 py-3 text-center">{ramo.count}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>


              {/* Tabla audit_log */}
              <section className="bg-white rounded-2xl shadow border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Registro de logeos
                  </h2>
                  <span className="text-sm font-medium text-slate-500">
                    {auditLog.length} registros
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-left text-sm text-slate-600 uppercase tracking-wide">
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Rut usuario</th>
                        <th className="px-4 py-2">Correo</th>
                        <th className="px-4 py-2">Rol</th>
                        <th className="px-4 py-2">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-6 text-center text-slate-500"
                          >
                            Aún no existen registros de auditoría.
                          </td>
                        </tr>
                      ) : (
                        auditLogRows.map((log) => (
                          <tr
                            key={`${log.rut_usuario}-${log.fecha}`}
                            className="border-b border-slate-100 text-sm text-slate-700"
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              {log.fechaFormateada}
                            </td>
                            <td className="px-4 py-3">{log.rut_usuario}</td>
                            <td className="px-4 py-3">
                              {log.usuario?.email || "Sin correo"}
                            </td>
                            <td className="px-4 py-3 uppercase">
                              {log.usuario?.rol || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {log.accion || "Sin detalle"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Tabla Ramos */}
              <section className="bg-white rounded-2xl shadow border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Ramos registrados
                  </h2>
                  <span className="text-sm font-medium text-slate-500">
                    {ramos.length} ramos cargados.
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-left text-sm text-slate-600 uppercase tracking-wide">
                        <th className="px-4 py-2">Código</th>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Créditos</th>
                        <th className="px-4 py-2">Nivel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ramos.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-6 text-center text-slate-500"
                          >
                            No hay ramos cargados en la base de datos.
                          </td>
                        </tr>
                      ) : (
                        ramos.map((ramo) => (
                          <tr
                            key={ramo.codigo}
                            className="border-b border-slate-100 text-sm text-slate-700"
                          >
                            <td className="px-4 py-3">{ramo.codigo}</td>
                            <td className="px-4 py-3">{ramo.nombre}</td>
                            <td className="px-4 py-3">{ramo.creditos}</td>
                            <td className="px-4 py-3">
                              {ramo.nivel || "Sin nivel"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          </div>
        </div>
  );
}

export default AdminHome;
