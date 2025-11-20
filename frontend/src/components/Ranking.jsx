import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { HiChevronUp, HiChevronDown, HiX} from "react-icons/hi";
import Plan from "./Planificacion/PLan";
import Header from "./Utils/Header";
import SideMenu from "./Utils/SideMenu";
import Footer from "./Utils/Footer";
import RestrictedAcces from "./Utils/RestrictedAcces";
import Loading from "./Utils/Loading";
import Toast from "./Utils/Toast";
import RankingBar from "./RankingBar";

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
  const [type, setType] = useState("")
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

    try {
      setLoading(true)
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
      setLoading(false)
      setMensaje("Rankings actualizados correctamente");
      setType("success")
    } catch (err) {
      console.error(err);
      setLoading(false)
      setMensaje("No se pudo guardar el ranking");
      setType("error")
    }
  };

  
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 5000); // 3 segundos
      return () => clearTimeout(timer);
    }
  }, [mensaje]);


  
  const mostrarPlan = (plan) => {
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



  if (loading) return <Loading mensaje="Cargando Ranking"/>

  if (error) return <RestrictedAcces error={error}/>

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">

      {/* Header */}
      <Header setMenuOpen={setMenuOpen} title={'Ranking de Planes'}>
        <Button color="blue" onClick={handleSave}>
          Guardar cambios
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
