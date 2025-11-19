import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button,Spinner} from "flowbite-react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Plan from "./Planificacion/PLan";
import Footer from "./Footer";


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

    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">
        {/* Header */}
        <Header setMenuOpen={setMenuOpen} title={'Planificacion Curricular Optimizada'}/>

        {/* Sidebar overlay */}
        {menuOpen && (
          <SideMenu setMenuOpen={setMenuOpen} handleLogout={handleLogout}>
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
          </SideMenu>
        )}


          {/* Contenido principal */}
          <div className="flex-1 p-6">

            <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">
              ¡Hola Alumno!
            </h1>

            <Plan semestreActual={semestreActual} planificacion={planificacion}/>

          </div>
      </div>
      <Footer/>
    </div>

    
    
  );
}

export default Home;
