import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [planificacion, setPlanificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSemestres, setOpenSemestres] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/planification/obtener/1", {
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
  }, []);

  const toggleSemestre = (sem) => {
    setOpenSemestres((prev) => ({ ...prev, [sem]: !prev[sem] }));
  };

  const formatSemestre = (sem) => {
    const year = sem.slice(0, 4);
    const code = sem.slice(4);
    switch (code) {
      case "10":
        return `${year} - Primer semestre`;
      case "20":
        return `${year} - Segundo semestre`;
      case "15":
        return `${year} - Verano`;
      case "25":
        return `${year} - Invierno`;
      default:
        return `${year} - Semestre desconocido`;
    }
  };

  const getRamoColor = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "aprobado":
        return "bg-green-200 text-green-900";
      case "reprobado":
        return "bg-red-200 text-red-900";
      case "pendiente":
        return "bg-blue-200 text-blue-900";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/')
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-800 bg-white">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 bg-white">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Menu lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white shadow-lg transform transition-transform z-50
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col pt-16 p-6 space-y-6">
          <h2 className="text-2xl font-bold">Menú</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        {/* Botón menú hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mb-4 px-3 py-2 bg-blue-800 text-white rounded-md shadow hover:bg-blue-900 focus:outline-none relative z-50"
        >
          ☰
        </button>

        <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">
          ¡Hola Alumno!
        </h1>

        <div className="space-y-4 max-w-3xl mx-auto">
          {planificacion.map((semestre, i) => (
            <div
              key={i}
              className="rounded-lg shadow-lg overflow-hidden border border-blue-300"
            >
              <button
                onClick={() => toggleSemestre(semestre.sem)}
                className="w-full text-left p-4 bg-blue-300 hover:bg-blue-400 transition-colors font-semibold text-lg"
              >
                {formatSemestre(semestre.sem)}
              </button>

              {openSemestres[semestre.sem] && (
                <div className="p-4 bg-blue-100 space-y-2">
                  {semestre.ramos.map((ramo, j) => (
                    <div
                      key={j}
                      className={`p-2 rounded shadow ${getRamoColor(
                        ramo.estado
                      )}`}
                    >
                      <strong>{ramo.nombre}</strong> -{" "}
                      {ramo.estado ?? "Sin estado"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
