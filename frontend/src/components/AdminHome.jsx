import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AdminHome() {
  const [auditLog, setAuditLog] = useState([]);
  const [ramos, setRamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auditRes, ramosRes] = await Promise.all([
          axios.get("http://localhost:3001/admin/audit-log"),
          axios.get("http://localhost:3001/admin/ramos"),
        ]);
        setAuditLog(auditRes.data);
        setRamos(ramosRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "No se pudieron cargar los datos del administrador"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-xl text-slate-600 animate-pulse">
          Cargando datos del administrador...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <p className="text-lg font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="bg-white rounded-2xl shadow p-8 border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Panel Administrador</h1>
          <p className="text-slate-500 mt-2">
            Información de ({" "}
            <span className="font-semibold text-slate-700">audit_log</span> y{" "}
            <span className="font-semibold text-slate-700">ramo </span>).
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              audit_log
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
                      <td className="px-4 py-3">{log.accion || "Sin detalle"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-slate-900">Ramos</h2>
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
                      <td className="px-4 py-3">{ramo.nivel || "Sin nivel"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminHome;
