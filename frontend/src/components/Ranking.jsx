import React, { useEffect, useState } from "react";
import {Header, SideMenu, Footer, RestrictedAcces, Loading, Toast} from "./Utils/index"
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import RankingBar from "./RankingBar";
import { useApi } from "../hooks/useApi";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [planes, setPlanes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [planSelect, setPlanSelect] = useState(null);
  const [semestre, setSemestre] = useState({});
  const [planificacion, setPlanificacion] = useState([]);
  const [type, setType] = useState("")
  const navigate = useNavigate();
  const {getBaseUrl} = useApi();
  const {getHeaderToken} = useAuth();
  const baseUrl = getBaseUrl();
  const headerToken = getHeaderToken();

  useEffect(() => {

    axios.get(`${baseUrl}/planification/obtener-todo`, headerToken)
    .then(res => {
      const ordenados = [...res.data].sort((a, b) => a.ranking - b.ranking);
      setPlanes(ordenados);
      setLoading(false);
    })
    .catch(error => {
      setError(error.message);
      setLoading(false);
    })

    axios.get(`${baseUrl}/get-all/semestre`, headerToken)
    .then(res => {
        setSemestre(res.data);
        setLoading(false);
      })
    .catch(error => {
        setError(error.message);
        setLoading(false);
    })

  }, []);


  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 5000); // 3 segundos
      return () => clearTimeout(timer);
    }
  }, [mensaje]);


  const handleDelete = async (plan) => {
    axios.delete(
      `${baseUrl}/planification/eliminar-plan`,
      { data: plan,
        ...headerToken
    })
    .then(res => {
      setLoading(false);
      setMensaje("PLan eliminado correctamente");
      setType("success");
    })
    .catch(err => {
      setMensaje("No se pudo eliminar el plan");
      setType("error");
      setLoading(false);
    });
    setPlanes([...planes].filter(x => x.ranking !== plan.ranking))
  }

  const handleSave = async () => {

    axios.post(
      `${baseUrl}/planification/actualizar-ranking`,
      {planes},
      headerToken
    )
      .then(res => {
        setLoading(false);
        setMensaje("Rankings actualizados correctamente");
        setType("success");
      })
      .catch(err => {
        setMensaje("No se pudo guardar el ranking");
        setType("error");
        setLoading(false);
        throw new Error("Error al guardar rankings");
      });

  };


  const getPLan = async (rank) => {

    axios.get(
      `${baseUrl}/planification/obtener/${rank}`, headerToken)
    .then(res => {
      setPlanificacion(res.data);
    })
    .catch(err => {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
    })
    .finally(() => {
      setLoading(false);
    });
  }
  
  const mostrarPlan = (plan) => {
    getPLan(plan.ranking)
    setPlanSelect(plan);
  }

  const handleCerrar = () => {
    setPlanSelect(null)
  }

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

  //despues utilizar esta info para agregar info extra por cada plan del ranking
  //const togglePlan = (key) => {
  //  setOpenPlan((prev) => ({ ...prev, [key]: !prev[key] }));
  //};



  if (loading) return <Loading mensaje="Cargando Ranking"/>

  if (error) return <RestrictedAcces error={error}/>

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">

      {/* Header */}
      <Header setMenuOpen={setMenuOpen} title={'Ranking de Planes'}>
        <Button color="blue" onClick={handleSave}>
          Guardar posiciones
        </Button>
      </Header>

      {/* Sidebar */}
      {menuOpen && (
        <SideMenu setMenuOpen={setMenuOpen} >
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

        <div className="space-y-3 max-w-3xl mx-auto">
          <RankingBar 
            planes={planes} 
            moveDown={moveDown} 
            moveUp={moveUp} 
            mostrarPlan={mostrarPlan} 
            planificacion={planificacion} 
            semestre={semestre} 
            handleCerrar={handleCerrar} 
            planSelect={planSelect}
            handleDelete={handleDelete}
          />

        {mensaje && (
          <Toast message={mensaje} type={type}/>
        )}

        </div>
      </div>
      
    </div>
    <Footer/>
    </div>
  );
}

export default Home;
