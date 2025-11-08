import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Card, Spinner, Alert } from "flowbite-react";

export default function MainForm() {
  const [nombrePlan, setNombrePlan] = useState("");
  const [ramos, setRamos] = useState([]);
  const [priority, setPriority] = useState([]);
  const [postponed, setPostponed] = useState([]);
  const [maxCredits, setMaxCredits] = useState(32);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [disponibles, setDisponibles] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {


  async function fetchData() {
    try {
      // obtener todos los ramos
      const resRamos = await fetch("http://localhost:3001/get-all/ramos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const dataRamos = await resRamos.json();
      console.log(dataRamos)
      setRamos(Array.isArray(dataRamos) ? dataRamos : []);

      // obtener aprobados
      const resAprobados = await fetch("http://localhost:3001/get-all/aprobados", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const dataAprobados = await resAprobados.json();
      console.log(dataAprobados)

      // preparar body para disponibles
      const pendientes = await dataRamos.map(r => r.codigo);
      console.log(pendientes)
      
      const body = {
        pendientes,
        aprobados: dataAprobados.map(a => a.codigo_ramo),
      };

      // obtener disponibles
      const resDisponibles = await fetch("http://localhost:3001/get-all/disponibles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const dataDisponibles = await resDisponibles.json();
      setDisponibles(Array.isArray(dataDisponibles) ? dataDisponibles : []);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  fetchData();
}, [token]);

  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("rol");
    navigate('/');
  };


  //Se hace con metodo post para poder enviar los ramos postpuestos y priorizados.
  //no es redundante tener catch y ademas el if, pq con el if estas recibiendo el error de si ya existe la planificacion
  //con el catch recibes cualquier error.
  const generarPlanificacion = async () => {
    setLoadingPlan(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/planification/generar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombrePlan,
          maxCredits,
          postponed,
          priority,
        }),
      });

      const data = await res.json().catch(() => ({})); // evita error si no hay JSON

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Hubo un error al generar la planificación, prueba cambiando el nombre.");
      }

      console.log("Plan generado:", data);
      navigate("/Home");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoadingPlan(false);
    }
  };



  const moveCourse = (course, from, to) => {
    // helper to remove
    const removeFrom = (list, setter) => setter(list.filter((c) => c.codigo !== course.codigo));
    // don't add duplicates
    const addTo = (list, setter) => {
      if (!list.some((c) => c.codigo === course.codigo)) setter([...list, course]);
    };

    if (from === "ramos") removeFrom(ramos, setRamos);
    if (from === "priority") removeFrom(priority, setPriority);
    if (from === "postponed") removeFrom(postponed, setPostponed);

    if (to === "ramos") addTo(ramos, setRamos);
    if (to === "priority") addTo(priority, setPriority);
    if (to === "postponed") addTo(postponed, setPostponed);
  };

  
  if (loadingPlan) {
    return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 z-50">
      <Spinner size="xl" />
      <p className="mt-4 text-blue-700 font-semibold text-lg">Generando plan...</p>
    </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert color="failure">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">
      {errorMsg && <Alert color="failure">{errorMsg}</Alert>}

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-blue-100 transition"
          >
            {/* Hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-blue-700">Planificación de Ramos</h1>
        </div>

        <div className="hidden md:flex items-center gap-4">
        </div>
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col">
            <div>
              <h2 className="text-lg font-bold text-blue-700 mb-4">Menú</h2>
              <p className="text-sm text-slate-500 mb-6">Opciones rápidas</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button color="purple" onClick={() => navigate('/Home')}>
                Volver
              </Button>

              <Button color="light" onClick={() => setSidebarOpen(false)}>
                Cerrar
              </Button>
            </div>

            {/* Botón de logout abajo */}
            <Button color="red" onClick={() => handleLogout()} className="mt-auto">
              Cerrar Sesión
            </Button>
          </aside>
        </div>
      )}


      {/* Main content */}
      <main className="p-6 max-w-6xl mx-auto">
      {/* Nombre planificación + Límite de créditos en la misma línea */}
<div className="flex flex-col gap-4 mb-6">
  {/* Nombre planificación */}
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-1">
    <span className="text-sm font-medium text-slate-600 md:w-44">
      Nombre planificación:
    </span>
    <TextInput
      id="planName"
      type="text"
      value={nombrePlan}
      onChange={(e) => setNombrePlan(e.target.value)}
      placeholder="Ej: Plan Semestre 1"
      className="flex-1 rounded-xl shadow-sm p-3"
    />
  </div>

  {/* Límite de créditos */}
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-1">
    <span className="text-sm font-medium text-slate-600 md:w-56">
      Límite de créditos por semestre:
    </span>
    <TextInput
      id="credits"
      type="number"
      value={maxCredits}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (Number.isNaN(v)) return;
        if (v > 32) return setMaxCredits(32);
        if (v < 0) return setMaxCredits(0);
        setMaxCredits(v);
      }}
      min={0}
      max={32}
      className="flex-1 rounded-xl shadow-sm p-3"
    />
  </div>
</div>




        {/* Available ramos - wide grid */}
        <section className="mb-6">
          <Card className="bg-white/80 shadow-lg rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Ramos disponibles</h2>
              <div className="text-sm text-slate-500">Total: {ramos.length}</div>
            </div>

            <Alert color="warning">
              No debes postergar todos los ramos disponibles para el próximo semestre. De lo contrario no te permitira continuar
            </Alert>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ramos.length === 0 && <div className="col-span-full text-slate-500">No hay ramos disponibles</div>}

              {ramos.map((r) => (
                <article
                  key={r.codigo}
                  className="p-4 bg-blue-50/70 rounded-xl shadow-md hover:scale-[1.01] transition transform"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm text-blue-800">{r.nombre}</h3>
                      <div className="text-xs text-slate-500">{r.codigo}</div>
                      {r.creditos !== undefined && (
                        <div className="text-xs text-slate-500 mt-1">{r.creditos} créditos</div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => moveCourse(r, "ramos", "priority")}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:brightness-95"
                      >
                        Priorizar
                      </button>

                      {/* Mostrar botón Postergar solo si el ramo está en los disponibles */}
                      {disponibles.includes(r.codigo) && (
                        <button
                          onClick={() => moveCourse(r, "ramos", "postponed")}
                          className="px-3 py-1 rounded-lg text-sm font-medium bg-rose-100 text-rose-700 hover:brightness-95"
                        >
                          Postergar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </section>

        {/* Priority & Postponed side-by-side */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-lg bg-white/90">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-blue-700">Prioridad</h3>
              <div className="text-sm text-slate-500">{priority.length}</div>
            </div>

            <div className="flex flex-col gap-3">
              {priority.length === 0 && <div className="text-slate-500">No hay ramos priorizados</div>}

              <div className="grid grid-cols-1 gap-3">
                {priority.map((r) => (
                  <div key={r.codigo} className="p-3 bg-emerald-50 rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-emerald-800">{r.nombre}</div>
                      <div className="text-xs text-slate-400">{r.codigo}</div>
                    </div>
                    <div>
                      <button onClick={() => moveCourse(r, "priority", "ramos")} className="px-3 py-1 rounded-md text-sm bg-white border border-emerald-200">
                        Volver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-white/90">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-blue-700">Postergados</h3>
              <div className="text-sm text-slate-500">{postponed.length}</div>
            </div>

            <div className="flex flex-col gap-3">
              {postponed.length === 0 && <div className="text-slate-500">No hay ramos postergados</div>}

              <div className="grid grid-cols-1 gap-3">
                {postponed.map((r) => (
                  <div key={r.codigo} className="p-3 bg-rose-50 rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-rose-800">{r.nombre}</div>
                      <div className="text-xs text-slate-400">{r.codigo}</div>
                    </div>
                    <div>
                      <button onClick={() => moveCourse(r, "postponed", "ramos")} className="px-3 py-1 rounded-md text-sm bg-white border border-rose-200">
                        Volver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Footer actions */}
        <div className="mt-6 flex justify-center">
          <Button color="purple" onClick={() => generarPlanificacion()}>Guardar planificación</Button>
        </div>
      </main>
    </div>
  );
}
