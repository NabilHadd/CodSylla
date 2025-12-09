import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Card, Alert } from "flowbite-react";
import {Header, SideMenu, Footer, RestrictedAcces, Loading, Toast} from "./Utils/index"
import { useApi } from "../hooks/useApi";
import axios from "axios";
import RamoForm from "./Form/RamoForm";
import { useAuth } from "../hooks/useAuth";

export default function MainForm() {
  const [nombrePlan, setNombrePlan] = useState("");
  const [ramos, setRamos] = useState([]);
  const [priority, setPriority] = useState([]);
  const [postponed, setPostponed] = useState([]);
  const [maxCredits, setMaxCredits] = useState(32);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const [disponibles, setDisponibles] = useState([]);
  const [type, setType] = useState("");
  const {getBaseUrl} = useApi();
  const {getHeaderToken, getToken} = useAuth();

  const baseUrl = getBaseUrl();
  const headerToken = getHeaderToken()
  const token = getToken()

  useEffect(() => {


  async function fetchData() {
    try {
      // obtener todos los ramos
      const resRamos = await axios.get(`${baseUrl}/ramo/ramos-pendientes`, headerToken);

      const dataRamos = resRamos.data;

      console.log(dataRamos);

      setRamos(Array.isArray(dataRamos) ? dataRamos : []);

      // obtener disponibles
      const resDisponibles = await axios.get(
        `${baseUrl}/get-all/disponibles`,
        headerToken
      );

      const dataDisponibles = resDisponibles.data;

      setDisponibles(Array.isArray(dataDisponibles) ? dataDisponibles : []);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  fetchData();
}, [token]);


  //Se hace con metodo post para poder enviar los ramos postpuestos y priorizados.
  //no es redundante tener catch y ademas el if, pq con el if estas recibiendo el error de si ya existe la planificacion
  //con el catch recibes cualquier error.
  const generarPlanificacion = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setMensaje("");

    axios.post(
      `${baseUrl}/planification/generar`,
      {
        nombre: nombrePlan,
        maxCredits,
        postponed,
        priority,
      },
      headerToken
    )
    .then(res => {
      const data = res.data;

      if (!data.success) {
        throw new Error(data.error || "Hubo un error al generar la planificación, prueba cambiando el nombre.");
      }
      setMensaje("Planificación generada sin problemas.");
      setType("success");
    })
    .catch(err => {
      const msg = err.response?.data?.error || err.message;
      setMensaje(msg);
      setType("error");
    })
    .finally(() => {
      setLoading(false);
    });

  };



  const moveCourse = (course, from, to) => {
    // helper to remove
    const removeFrom = (list, setter) => setter(list.filter((c) => c.codigo !== course.codigo));
    // don't add duplicates
    const addTo = (list, setter) => {
      if (!list.some((c) => c.codigo === course.codigo)) setter([...list, course]);
    };

    if (from === "ramos") removeFrom(ramos, setRamos);
    if (from === "priority") removeFrom(priority, setPriority);
    if (from === "postponed") removeFrom(postponed, setPostponed);

    if (to === "ramos") addTo(ramos, setRamos);
    if (to === "priority") addTo(priority, setPriority);
    if (to === "postponed") addTo(postponed, setPostponed);
  };


  if (loading) return <Loading mensaje="Cargando pestaña"/>;

  if (error) return <RestrictedAcces error={''}/>;


  return (

    <div>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">
      {/* Header */}
      <Header setMenuOpen={setMenuOpen}/>

      {/* Sidebar overlay */}
      {menuOpen && (
        <SideMenu setMenuOpen={setMenuOpen} >
              <Button color="purple" onClick={() => navigate('/Home')}>
                Volver
              </Button>

              <Button color="light" onClick={() => setMenuOpen(false)}>
                Cerrar
              </Button>
        </SideMenu>
      )}



      {/* Main content */}
      <main className="p-6 max-w-6xl mx-auto">
      {/* Nombre planificación + Límite de créditos en la misma línea */}
<div className="flex flex-col gap-4 mb-6">
  {/* Nombre planificación */}
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-1">
    <span className="text-sm font-medium text-slate-600 md:w-44">
      Nombre planificación:
    </span>
    <TextInput
      id="planName"
      type="text"
      value={nombrePlan}
      onChange={(e) => setNombrePlan(e.target.value)}
      placeholder="Ej: Plan Semestre 1"
      className="flex-1 rounded-xl shadow-sm p-3"
    />
  </div>

  {/* Límite de créditos */}
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-1">
    <span className="text-sm font-medium text-slate-600 md:w-56">
      Límite de créditos por semestre:
    </span>
    <TextInput
      id="credits"
      type="number"
      value={maxCredits}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (Number.isNaN(v)) return;
        if (v > 32) return setMaxCredits(32);
        if (v < 0) return setMaxCredits(0);
        setMaxCredits(v);
      }}
      min={0}
      max={32}
      className="flex-1 rounded-xl shadow-sm p-3"
    />
  </div>
</div>




        {/* Available ramos - wide grid */}
        <section className="mb-6">
          <Card className="bg-white/80 shadow-lg rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Ramos disponibles</h2>
              <div className="text-sm text-slate-500">Total: {ramos.length}</div>
            </div>

            <Alert color="warning">
              No debes postergar todos los ramos disponibles para el próximo semestre. De lo contrario no te permitira continuar
            </Alert>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {ramos.length === 0 && <div className="col-span-full text-slate-500">No hay ramos disponibles</div>}

              {ramos.map((r) => (
                  <RamoForm key={r.codigo} ramo={r}>
                      <button
                        onClick={() => moveCourse(r, "ramos", "priority")}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:brightness-95"
                      >
                        Priorizar
                      </button>
                      {/* Mostrar botón Postergar solo si el ramo está en los disponibles */}
                      {disponibles.includes(r.codigo) && (
                        <button
                          onClick={() => moveCourse(r, "ramos", "postponed")}
                          className="px-3 py-1 rounded-lg text-sm font-medium bg-rose-100 text-rose-700 hover:brightness-95"
                        >
                          Postergar
                        </button>
                      )}
                  </RamoForm>
              ))}

            </div>
          </Card>
        </section>




        {/* Priority & Postponed side-by-side */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-lg bg-white/90">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-blue-700">Prioridad</h3>
              <div className="text-sm text-slate-500">{priority.length}</div>
            </div>

            <div className="flex flex-col gap-3">
              {priority.length === 0 && <div className="text-slate-500">No hay ramos priorizados</div>}

              <div className="grid grid-cols-1 gap-3">
                {priority.map((r) => (
                  <RamoForm key={r.codigo} ramo={r}>
                      <button onClick={() => moveCourse(r, "priority", "ramos")} className="px-3 py-1 rounded-md text-sm bg-white border border-emerald-200">
                        Volver
                      </button>
                  </RamoForm>
                ))}
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-white/90">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-blue-700">Postergados</h3>
              <div className="text-sm text-slate-500">{postponed.length}</div>
            </div>

            <div className="flex flex-col gap-3">
              {postponed.length === 0 && <div className="text-slate-500">No hay ramos postergados</div>}

              <div className="grid grid-cols-1 gap-3">
                {postponed.map((r) => (
                  <RamoForm key={r.codigo} ramo={r}>
                      <button onClick={() => moveCourse(r, "postponed", "ramos")} className="px-3 py-1 rounded-md text-sm bg-white border border-rose-200">
                        Volver
                      </button>
                  </RamoForm>
                ))}
              </div>
            </div>
          </Card>

        {mensaje && 
        <Toast message={mensaje} type={type}/>
        }
        </section>

        {/* Footer actions */}
        <div className="mt-6 flex justify-center">
          <Button color="purple" onClick={() => generarPlanificacion()}>Guardar planificación</Button>
        </div>
      </main>
      </div>
      <Footer/>
    </div>
  );
}
