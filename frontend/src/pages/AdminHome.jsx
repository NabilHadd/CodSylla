import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Footer, Header, SideMenu, RestrictedAcces, Loading, Tabla} from "../components/index";
import { Button } from "flowbite-react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import LogsPorDiaChart from "../components/LogGraph";



export default function AdminHome() {
  const [auditLog, setAuditLog] = useState([]);
  const [auditRamos, setAuditRamos] = useState([]);
  const [actualSem, setActualSem] = useState(null);
  const [selectedSem, setSelectedSem] = useState();
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  

  const logChartData = () => {
    const fechas = [...new Set(
      auditLog.map(x => new Date(x.fecha).toISOString().slice(0, 10))
    )].sort((a, b) => new Date(a) - new Date(b));

    const data = fechas.map(fecha => ({
      fecha,
      total: auditLog.filter(
        z => new Date(z.fecha).toISOString().slice(0, 10) === fecha
      ).length
    }));

    return data;
  };

  const { getHeaderToken} = useAuth();
  const {getBaseUrl} = useApi()
  
  const ramosFiltrados = filtroCarrera
    ? auditRamos.filter((r) => r.carrera?.codigo === filtroCarrera)
    : auditRamos;

  const siguienteSem = (sem) => {
    const anio = Math.floor(sem / 100);
    const semNum = sem % 100;
    if (semNum === 10) return anio * 100 + 20;
    return (anio + 1) * 100 + 10;
  };

  const formatSemestre = (sem) => {
    logChartData();
    const s = String(sem);
    const year = s.slice(0, 4);
    const code = s.slice(4);
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
useEffect(() => {
  let didCancel = false;
  const controller = new AbortController();

  const fetchBaseData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        auditRes,
        actualSemRes,
        carrerasRes,
        usuariosRes
      ] = await Promise.all([
        axios.get(`${getBaseUrl()}/admin/audit-log`, { ...getHeaderToken(), signal: controller.signal }),
        axios.get(`${getBaseUrl()}/get-all/semestre`, { ...getHeaderToken(), signal: controller.signal }),
        axios.get(`${getBaseUrl()}/get-all/carreras`, { ...getHeaderToken(), signal: controller.signal }),
        axios.get(`${getBaseUrl()}/users`, { ...getHeaderToken(), signal: controller.signal }),
      ]);

      if (didCancel) return;

      setAuditLog(auditRes.data);
      setActualSem(actualSemRes.data);
      setCarreras(carrerasRes.data);
      setUsuarios(usuariosRes.data);

    } catch (err) {
      if (!didCancel) {
        setError(
          err?.response?.data?.message ||
          err.message ||
          "No se pudieron cargar los datos"
        );
      }
    } finally {
      if (!didCancel) setLoading(false);
    }
  };

  fetchBaseData();

  return () => {
    didCancel = true;
    controller.abort();
  };
}, [reloadKey, getBaseUrl, getHeaderToken]);

useEffect(() => {
  if (!actualSem) return;

  let didCancel = false;
  const controller = new AbortController();

  const fetchAuditRamos = async () => {
    try {
      const res = await axios.post(
        `${getBaseUrl()}/admin/audit-ramos`,
        { semestre: selectedSem ? selectedSem : siguienteSem(actualSem) },
        { ...getHeaderToken(), signal: controller.signal }
      );

      if (!didCancel) {
        setAuditRamos(res.data);
      }
    } catch (err) {
      if (!didCancel) {
        console.error("Error audit-ramos", err);
      }
    }
  };

  fetchAuditRamos();

  return () => {
    didCancel = true;
    controller.abort();
  };
}, [selectedSem, getBaseUrl, getHeaderToken]);


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

  if (loading) return <Loading mensaje="Cargando panel administrador" />;
  if (error) return <RestrictedAcces error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">
      <Header setMenuOpen={setMenuOpen} title="Admin Dashboard" />


      {menuOpen && (
        <SideMenu setMenuOpen={setMenuOpen}>
          <Button color="light" onClick={() => setMenuOpen(false)}>
            Cerrar
          </Button>
        </SideMenu>
      )}

<div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
      <p className="text-sm text-slate-500">Usuarios registrados</p>
      <p className="text-3xl font-bold text-slate-900">{usuarios.filter(x => x.rol !== 'admin').length}</p>
    </div>

    <div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
      <p className="text-sm text-slate-500">Carreras Registradas</p>
      <p className="text-3xl font-bold text-slate-900">{carreras.length}</p>
    </div>
  </section>



      {/* Tablas*/}
      <Tabla
        title={`Conteo de alumnos por ramo desde ${formatSemestre(siguienteSem(actualSem))}`}
        columns={[
          { label: "Código", key: "codigo_ramo" },
          { label: "Nombre", key: "nombre" },
          { label: "Carrera", key: "carrera" }, // o una key plana si la tienes
          { label: "Alumnos", key: "count" },
        ]}
        data={ramosFiltrados}
        rowMapper={(ramo) => (
          <tr key={ramo.codigo_ramo} className="border-b border-slate-100 text-sm text-slate-700">
            <td className="px-4 py-3">{ramo.codigo_ramo}</td>
            <td className="px-4 py-3">{ramo.nombre || "Sin nombre"}</td>
            <td className="px-4 py-3">{ramo.carrera?.nombre || ramo.carrera?.codigo || "Sin carrera"}</td>
            <td className="px-4 py-3 text-center">{ramo.count}</td>
          </tr>
        )}
        summary={`${ramosFiltrados.length} ramos mostrados`}
        filtro={{filter: filtroCarrera, setter: setFiltroCarrera, options: carreras.map(c => ({label: c.nombre, value: c.codigo}))}}
        filtroSem={{setter: setSelectedSem, filter: selectedSem, actualSem: Math.floor(siguienteSem(actualSem) / 100)}}
      />


<section className="bg-white rounded-2xl shadow border border-slate-100 p-6">
  <h2 className="text-xl font-semibold text-slate-900 mb-4">
    Tráfico de logeos por día
  </h2>
  <LogsPorDiaChart data={logChartData()} />
</section>

      <Tabla
        title={`Auditoria de Logeos`}
        columns={[
          { label: "Fecha", key: "fecha" },
          { label: "Rut usuario", key: "rut_usuario" },
          { label: "Correo", key: "correo" }, // o una key plana si la tienes
          { label: "Rol", key: "rol" },
          { label: "Acción", key: "action" },
        ]}
        data={auditLogRows}
        rowMapper={(log) => (
          <tr
            key={`${log.rut_usuario}-${log.fecha}`}
            className="border-b border-slate-100 text-sm text-slate-700"
          >
            <td className="px-4 py-3 whitespace-nowrap">
              {log.fechaFormateada}
            </td>
            <td className="px-4 py-3">
              {log.rut_usuario}
            </td>
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
        )}
        limite={true}
      />

</div>
      




      <Footer />
    </div>
  );
}


