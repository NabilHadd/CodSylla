import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Plan from "./Planificacion/PLan";
import { useApi } from "../hooks/useApi";
import { Button} from "flowbite-react";
import {Header, SideMenu, Footer, RestrictedAcces, Loading, Toast} from "./Utils/index"
import SimulRamos from "./SimulRamos";
import axios from "axios";



function Home() {

  
const IToastType = {
  SUCCESS: 'success',
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warning'
}


  const [semestreActual, setSemestreActual] = useState(null);
  const [planificacion, setPlanificacion] = useState([]);
  const [nombrePlan, setNombrePlan] = useState('');
  const [simulRamos, setSimulRamos] = useState(false);
  const [ramosActuales, setRamosActuales] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const {getToken, getHeaderToken} = useAuth();
  const {getBaseUrl} = useApi();  
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] =  useState("");
  const [toastKey, setToastKey] = useState(0);
  const [toastType, setToastType] = useState(IToastType.INFO);

  const navigate = useNavigate();
  const token = getToken()
  const headerToken = getHeaderToken()
  const baseUrl = getBaseUrl()


  useEffect(() => {


    axios.get(`${baseUrl}/planification/obtener/1`, headerToken)
    .then(res => {
      setPlanificacion(res.data);
    })
    .catch(err => {
      setError(err.message);
    });;

    axios.get(`${baseUrl}/planification/obtener-nombre/1`, headerToken)
    .then(res => {
      setNombrePlan(res.data);
    })
    .catch(err => {
      setError(err.message);
    });;

    axios.get(`${baseUrl}/get-all/semestre`, headerToken)
    .then(res => {
      setSemestreActual(res.data);
    }).catch(err => {
      setError(err.message);
    });

    axios.get(`${baseUrl}/ramo/ramos-actuales`, headerToken)
    .then(res => {
      setRamosActuales(res.data);
    }).catch(err => {
      setError(err.message)
    }).finally(() => {
      setLoading(false);
    });

  }, [token, simulRamos]);

  const handleToast = (state) => {
    if(state) {
      setMensaje('Simulación ramos actuales generada correctamente');
      setToastType(IToastType.SUCCESS);
      setToastKey(k => k+1);
      console.log('true')
    }else{
      setMensaje('Error al generar simulación de ramos actuales');
      setToastType(IToastType.SUCCESS);
      setToastKey(k => k+1);
      console.log('false')
    }
  };

  
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

            <Button color="purple" onClick={() => {setMenuOpen(false); setSimulRamos(true)}}>
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

        {/* Contenido principal*/}
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">
            Proyección: {nombrePlan}
          </h1>

          <Plan semestreActual={semestreActual} planificacion={planificacion}/>

          {/* Modal cuando simulRamos = true */}
          {simulRamos && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-lg">
                <SimulRamos ramos={ramosActuales} onClose={() => setSimulRamos(false) } handleToast={handleToast}/>
              </div>
            </div>
          )}

        </div>
      </div>
              {mensaje && (
                <Toast key={toastKey} message={mensaje} type={toastType}/>
              )}
      <Footer/>
    </div>
  );
}

export default Home;
