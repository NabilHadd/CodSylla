import React, { useEffect, useState } from "react";
import {Header, SideMenu, Footer, RestrictedAcces, Loading, Toast} from "./Utils/index"
import { useNavigate } from "react-router-dom";
import {renderToString} from "react-dom/server"
import { Button } from "flowbite-react";
import RankingBar from "./RankingBar";
import { useApi } from "../hooks/useApi";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import PrintedPlan from "./PrintedPlan.jsx/PrintedPlan";

export default function Ranking() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [toastKey, setToastKey] = useState(0);
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

  }, [planes]);



  const handleDelete = async (plan) => {
    axios.delete(
      `${baseUrl}/planification/eliminar-plan`,
      { data: plan,
        ...headerToken
    })
    .then(res => {
      setMensaje("PLan eliminado correctamente");
      setType("success");
      setToastKey(k => k + 1)
    })
    .catch(err => {
      setMensaje("No se pudo eliminar el plan");
      setType("error");
      setToastKey(k => k + 1)
    })
    .finally(()=>{
      setLoading(false);
    })
    setPlanes([...planes].filter(x => x.ranking !== plan.ranking))
  }



  const handleSave = async () => {

    axios.post(
      `${baseUrl}/planification/actualizar-ranking`,
      {planes},
      headerToken
    )
      .then(res => {
        setMensaje("Rankings actualizados correctamente");
        setType("success");
        setToastKey(k => k + 1)
      })
      .catch(err => {
        setMensaje("No se pudo guardar el ranking");
        setType("error");
        setToastKey(k => k + 1)
      })
      .finally(()=>{
        setLoading(false);
      })

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

    handleSave();
  };

  const moveDown = (index) => {
    if (index === planes.length - 1) return;
    const newPlanes = [...planes];
    [newPlanes[index + 1], newPlanes[index]] = [newPlanes[index], newPlanes[index + 1]];
    newPlanes.forEach((p, i) => (p.ranking = i + 1));
    setPlanes(newPlanes);

    handleSave();
  };



  const handleDownload = async (rank) => {

    const response = await axios.get(
      `${baseUrl}/planification/obtener/${rank}`,
      headerToken
    )

    const plan = response.data
    const body = renderToString(
    <PrintedPlan planificacion={plan} />
    );

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />

      <!-- Tailwind CDN -->
      <script src="https://cdn.tailwindcss.com"></script>

      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                primary: '#2563eb',
              },
            },
          },
        }
      </script>

      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 297mm;
          height: 210mm;
          background: white;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>

    <body>
      ${body}
    </body>
    </html>
    `;


    const res = await axios.post(
      `${baseUrl}/print/pdf`,
      { html },
      {
        ...headerToken,
        responseType: 'blob', // 👈 IMPORTANTE
      }
    );

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan.pdf';
    a.click();
  };



  if (loading) return <Loading mensaje="Cargando Ranking"/>

  if (error) return <RestrictedAcces error={error}/>

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">

      {/* Header */}
      <Header setMenuOpen={setMenuOpen} title={'Ranking de Planes'}/>

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
            handleDownload={handleDownload}
          />

        {mensaje && (
          <Toast key={toastKey} message={mensaje} type={type}/>
        )}

        </div>
      </div>
      
    </div>
    <Footer/>
    </div>
  );
}
