import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Plan from "./Planificacion/PLan";
import { useApi } from "../hooks/useApi";
import { Button} from "flowbite-react";
import {Header, SideMenu, Footer, RestrictedAcces, Loading} from "./Utils/index"




function Home() {
  const [semestreActual, setSemestreActual] = useState(null)
  const [planificacion, setPlanificacion] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const {getToken, getHeaderToken} = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = getToken()
  const {getBaseUrl} = useApi() 

  useEffect(() => {

    fetch(`${getBaseUrl()}/planification/obtener/1`, getHeaderToken())
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
      

      fetch(`${getBaseUrl()}/get-all/semestre`, getHeaderToken())
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

  }, [token]);

  
  if (loading) return <Loading mensaje="Cargando Home"/>


  if (error) return <RestrictedAcces error={error}/>


  return (

    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">
        {/* Header */}
        <Header setMenuOpen={setMenuOpen} title={'Planificacion Curricular Optimizada'}/>

        {/* Sidebar overlay */}
        {menuOpen && (
          <SideMenu setMenuOpen={setMenuOpen} >
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
