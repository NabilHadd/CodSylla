import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Spinner, Alert} from "flowbite-react";
import { HiChevronUp, HiChevronDown, HiX} from "react-icons/hi";
import Plan from "./Planificacion/PLan";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Footer from "./Footer";

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [planes, setPlanes] = useState([]);
  const [nombrePlan, setNombrePlan] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [planSelect, setPlanSelect] = useState(null);
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

          <Plan planificacion={planificacion} semestreActual={semestre}/>
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
      <Header setMenuOpen={setMenuOpen}>
        <Button color="blue" onClick={handleSave}>
          Guardar cambios
        </Button>
      </Header>

      {/* Sidebar */}
      {menuOpen && (
        <SideMenu setMenuOpen={setMenuOpen} handleLogout={handleLogout}>
              <Button color="blue" onClick={() => navigate("/Home")}>
                Volver
              </Button>
              <Button color="light" onClick={() => setMenuOpen(false)}>
                Cerrar
              </Button>
        </SideMenu>
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
      <Footer/>
    </div>
  );
}

export default Home;
