import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Card, Alert } from "flowbite-react";
import {Header, SideMenu, Footer, RestrictedAcces, Loading, Toast, Casilla, Nivel, ILabel} from "../components/index"
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";


export default function MainForm() {
  const [nombrePlan, setNombrePlan] = useState("");
  const [ramos, setRamos] = useState([]);
  const [priority, setPriority] = useState([]);
  const [postponed, setPostponed] = useState([]);
  const [reprobed, setReprobed] = useState([]);
  const [maxCredits, setMaxCredits] = useState(32);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const navigate = useNavigate();
  const [disponibles, setDisponibles] = useState([]);
  const [type, setType] = useState("");
  const {getBaseUrl} = useApi();
  const {getHeaderToken} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRamos, resDisponibles] = await Promise.all([
          axios.get(`${getBaseUrl()}/ramo/ramos-pendientes`, getHeaderToken()),
          axios.get(`${getBaseUrl()}/get-all/disponibles`, getHeaderToken()),
        ]);

        setRamos(resRamos.data || []);
        setDisponibles(resDisponibles.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getBaseUrl, getHeaderToken]);


  const generarPlanificacion = async () => {
    setLoading(true);
    setMensaje("");


    try {

      if (nombrePlan === "") throw new Error("Ingrese un nombre al plan");

      const { data } = await axios.post(
        `${getBaseUrl()}/planification/generar`,
        { nombre: nombrePlan, maxCredits, postponed, priority, reprobed},
        getHeaderToken()
      );

      if (!data.success) throw new Error(data.error);

      setMensaje("Planificación generada sin problemas.");
      setType("success");
      setToastKey(k => k + 1)
      navigate('/home')


    } catch (err) {
      setMensaje("Error: " + (err.response?.data?.message || err.message));
      setType("error");
      setToastKey(k => k + 1)
    } finally {
      setLoading(false);
    }
  };



  const moveCourse = (course, from, to) => {
    const map = {
      ramos: [ramos, setRamos],
      priority: [priority, setPriority],
      postponed: [postponed, setPostponed],
      reprobed: [reprobed, setReprobed],
    };

    const [fromList, fromSet] = map[from];
    const [toList, toSet] = map[to];

    fromSet(fromList.filter(c => c.codigo !== course.codigo));

    if (!toList.some(c => c.codigo === course.codigo)) {
      toSet([...toList, course]);
    }
  };




  if (loading) return <Loading mensaje="Cargando pestaña"/>;



  if (error) return <RestrictedAcces error={''}/>;


  return (

    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800">
          {/* Header */}
          <Header setMenuOpen={setMenuOpen} title={'Generar Planificación'}/>

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
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-blue-700">Ramos disponibles</h2>
                  <div className="text-sm text-slate-500">Total: {ramos.length}</div>
                </div>

                <Alert color="warning">
                  No debes postergar todos los ramos disponibles para el próximo semestre. De lo contrario no te permitira continuar
                </Alert>

                <Nivel ramos={ramos} disponibles={disponibles} moveCourse={moveCourse}/>

              </Card>
            </section>



            {/* Priority & Postponed side-by-side */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Casilla type='priorizados' array={priority} moveCourse={moveCourse} from={ILabel.PRIORITY} />
              <Casilla type='postergados' array={postponed} moveCourse={moveCourse} from={ILabel.POSTPONED} />
              <Casilla type='reprobados' array={reprobed} moveCourse={moveCourse} from={ILabel.REPROBED} />
            </section>
            
            {mensaje && 
            <Toast key={toastKey} message={mensaje} type={type}/>
            }

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
