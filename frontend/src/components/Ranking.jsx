import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Spinner, Alert} from "flowbite-react";
import { HiChevronUp, HiChevronDown, HiX} from "react-icons/hi";

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [planes, setPlanes] = useState([]);
  const [nombrePlan, setNombrePlan] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [planSelect, setPlanSelect] = useState(null);
  const [openSemestres, setOpenSemestres] = useState({});
  const [semestre, setSemestre] = useState({});
  const [planificacion, setPlanificacion] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/planification/obtener-todo", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener rankings");
        return res.json();
      })
      .then((data) => {
        const ordenados = [...data].sort((a, b) => a.ranking - b.ranking);
        setPlanes(ordenados);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });


    fetch("http://localhost:3001/get-all/semestre", {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener semestre actual");
        return res.json();
      })
      .then((data) => {
        setSemestre(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

  }, []);

  const getRankingColor = (rank) => {
    switch (Number(rank)) {
      case 1: return "bg-yellow-200 hover:bg-yellow-300 border-yellow-400";
      case 2: return "bg-lime-200 hover:bg-lime-300 border-lime-400";
      case 3: return "bg-purple-200 hover:bg-purple-300 border-purple-400";
      default: return "bg-blue-200 hover:bg-blue-300 border-blue-400";
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newPlanes = [...planes];
    [newPlanes[index - 1], newPlanes[index]] = [newPlanes[index], newPlanes[index - 1]];
    newPlanes.forEach((p, i) => (p.ranking = i + 1));
    setPlanes(newPlanes);
  };

  const moveDown = (index) => {
    if (index === planes.length - 1) return;
    const newPlanes = [...planes];
    [newPlanes[index + 1], newPlanes[index]] = [newPlanes[index], newPlanes[index + 1]];
    newPlanes.forEach((p, i) => (p.ranking = i + 1));
    setPlanes(newPlanes);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const body = { planes };

    setMensaje("");
    setError("");

    try {
      const res = await fetch("http://localhost:3001/planification/actualizar-ranking", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al guardar rankings");
      await res.json();

      setMensaje("Rankings actualizados correctamente ✅");
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el ranking ❌");
    }
  };

  
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 5000); // 3 segundos
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("rol");
    navigate("/");
  };
  
  const mostrarPlan = (plan) => {
    console.log('mostrar plan')
    console.log(JSON.stringify(plan))
    getPLan(plan.ranking)
    setPlanSelect(plan);
    setNombrePlan(plan.nombre_plan)
  }

    const toggleSemestre = (sem) => {
    setOpenSemestres((prev) => ({ ...prev, [sem]: !prev[sem] }));
  };

const formatSemestre = (sem) => {
  const year = sem.slice(0, 4);
  const code = sem.slice(4);
  const isActual = Number(sem) === semestre;
  const suffix = isActual ? ' (Semestre Actual)' : '';

  switch (code) {
    case "10":
      return `${year} - Primer semestre${suffix}`;
    case "20":
      return `${year} - Segundo semestre${suffix}`;
    case "15":
      return `${year} - Verano${suffix}`;
    case "25":
      return `${year} - Invierno${suffix}`;
    default:
      return `${year} - Semestre desconocido${suffix}`;
  }
};

  const getRamoColor = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "aprobado":
        return "bg-green-200 text-green-900 border border-green-400";
      case "reprobado":
        return "bg-red-200 text-red-900 border border-red-400";
      case "pendiente":
        return "bg-blue-200 text-blue-900 border border-blue-400";
      default:
        return "bg-gray-200 text-gray-900 border border-gray-400";
    }
  };

    const getSemestreColor = (sem) => {
      switch (Number(sem)) {
        case Number(semestre):
          return "yellow";
        default:
          return "blue";
      }
    };

  const handleCerrar = () => {
    setPlanSelect(null)
  }

  const getPLan = async (rank) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/planification/obtener/${rank}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener la planificación");
        return res.json();
      })
      .then((data) => {
        setPlanificacion(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

  }

  //despues utilizar esta info para agregar info extra por cada plan del ranking
  //const togglePlan = (key) => {
  //  setOpenPlan((prev) => ({ ...prev, [key]: !prev[key] }));
  //};

  if (planSelect) {
    return (
        <div className="flex-1 p-6 relative">
          {/* Botón cerrar */}
          <Button
            color="failure"
            pill
            size="xs"
            className="absolute top-4 right-4"
            onClick={handleCerrar}
            title="Cerrar"
          >
            <HiX className="h-5 w-5" />
          </Button>

          <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">
            Ranking: {nombrePlan}
          </h1>

          <div className="space-y-4 max-w-3xl mx-auto">
            {planificacion.map((semestre, i) => (
              <div
                key={i}
                className={`rounded-2xl shadow-md border border-${getSemestreColor(semestre.sem)}-400 overflow-hidden`}
              >
                <button
                  onClick={() => toggleSemestre(semestre.sem)}
                  className={`w-full text-left p-4 bg-${getSemestreColor(semestre.sem)}-200 hover:bg-${getSemestreColor(semestre.sem)}-400 transition-colors font-semibold text-lg`}
                >
                  {formatSemestre(semestre.sem)}
                </button>

                {openSemestres[semestre.sem] && (
                  <div className={`p-4 bg-${getSemestreColor(semestre.sem)}-50 space-y-2`}>
                    {semestre.ramos.map((ramo, j) => (
                      <div
                        key={j}
                        className={`p-2 rounded-xl shadow ${getRamoColor(ramo.estado)}`}
                      >
                        <strong>{ramo.nombre}</strong> -{" "}
                        {ramo.estado.toUpperCase() ?? "Sin estado"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

    );
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <div className="text-5xl">🚫</div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Acceso restringido
          </h1>
          <p className="text-slate-600">
            No podemos mostrar esta sección en este momento. {error}
          </p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl shadow transition-colors"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Botón de menú hamburguesa */}
          <button
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-blue-700">
            Ranking de planificaciones
          </h1>
        </div>

        <Button color="blue" onClick={handleSave}>
          Guardar cambios
        </Button>
      </header>

      {/* Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col">
            <div>
              <h2 className="text-lg font-bold text-blue-700 mb-4">Menú</h2>
              <p className="text-sm text-slate-500 mb-6">Opciones rápidas</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button color="blue" onClick={() => navigate("/Home")}>
                Volver
              </Button>
              <Button color="light" onClick={() => setMenuOpen(false)}>
                Cerrar
              </Button>
            </div>

            <Button color="red" onClick={handleLogout} className="mt-auto">
              Cerrar sesión
            </Button>
          </aside>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">
          Ranking de Planes
        </h1>

        <div className="space-y-3 max-w-3xl mx-auto">
          {planes.length > 0 ? (
            planes.map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl shadow-md border ${getRankingColor(
                  plan.ranking
                )} p-4 flex items-center justify-between transition`}
              >
                <div className="font-semibold text-lg text-slate-800">
                  {plan.nombre_plan ?? "Plan sin nombre"}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">{plan.ranking}</span>
                  <Button
                    color="light"
                    size="xs"
                    pill
                    onClick={() => moveUp(i)}
                    title="Subir"
                  >
                    <HiChevronUp className="h-4 w-4" />
                  </Button>

                  <Button
                    color="light"
                    size="xs"
                    pill
                    onClick={() => moveDown(i)}
                    title="Bajar"
                  >
                    <HiChevronDown className="h-4 w-4" />
                  </Button>

                  <Button
                    color="light"
                    size="xs"
                    onClick={() => mostrarPlan(plan)}
                  >
                    Mostrar
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No hay planes disponibles.</p>
          )}

        {mensaje && (
          <div className="max-w-md mx-auto mt-6">
            <Alert color="success" withBorderAccent>
              {mensaje}
            </Alert>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mt-6">
            <Alert color="failure" withBorderAccent>
              {error}
            </Alert>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Home;
