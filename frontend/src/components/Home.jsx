import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button,Spinner} from "flowbite-react";
import Ramo from "./Ramo";
import Semestre from "./Semestre";


function Home() {
  const [planificacion, setPlanificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [semestreActual, setSemestreActual] = useState(null)
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
          setSemestreActual(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });

  }, []);



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("rol");
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }


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
          <button
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-blue-100 transition"
          >
            {/* Hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-blue-700">Planificacion Curricular Optimizada</h1>
        </div>

        <div className="hidden md:flex items-center gap-4">
        </div>
      </header>

      {/* Sidebar overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col">
            <div>
              <h2 className="text-lg font-bold text-blue-700 mb-4">Menú</h2>
              <p className="text-sm text-slate-500 mb-6">Opciones rápidas</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button color="blue" onClick={() => navigate('/MainForm')}>
                Generar Planificación
              </Button>

              <Button color="purple">
                Simular Ramos
              </Button>

              <Button color="yellow" onClick={() => navigate('/Ranking')}>
                Ranking
              </Button>
              
              <Button color="light" onClick={() => setMenuOpen(false)}>
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


        {/* Contenido principal */}
        <div className="flex-1 p-6">

          <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">
            ¡Hola Alumno!
          </h1>

          <div className="space-y-4 max-w-3xl mx-auto">
            {planificacion.map((semestr, i) => (
              
              <div key={i}>
                <Semestre sem={semestr} semActual={semestreActual} />
              </div>
            ))}
          </div>
        </div>
    </div>
    
  );
}

export default Home;
