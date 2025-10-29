import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Card, Spinner, Alert } from "flowbite-react";

function MainForm() {
  const [nombrePlan, setNombrePlan] = useState("");
  const [ramos, setRamos] = useState([]);
  const [priority, setPriority] = useState([]);
  const [postponed, setPostponed] = useState([]);
  const [maxCredits, setMaxCredits] = useState(32);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/get-all/ramos", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los ramos");
        return res.json();
      })
      .then((data) => {
        setRamos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const moveCourse = (course, from, to) => {
    if (from === "ramos") setRamos(ramos.filter((c) => c.codigo !== course.codigo));
    if (from === "priority") setPriority(priority.filter((c) => c.codigo !== course.codigo));
    if (from === "postponed") setPostponed(postponed.filter((c) => c.codigo !== course.codigo));

    if (to === "ramos") setRamos([...ramos, course]);
    if (to === "priority") setPriority([...priority, course]);
    if (to === "postponed") setPostponed([...postponed, course]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert color="failure">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Planificación de Ramos</h1>

      {/* Nombre de la planificación */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <Label htmlFor="planName" value="Nombre Planificación" />
        <TextInput
          id="planName"
          type="text"
          value={nombrePlan}
          onChange={(e) => setNombrePlan(e.target.value)}
          placeholder="Ej: Plan Semestre 1"
        />
      </div>

      {/* Créditos máximos */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <Label htmlFor="credits" value="Créditos máximos por semestre" />
        <TextInput
          id="credits"
          type="number"
          value={maxCredits}
          onChange={(e) => setMaxCredits(Number(e.target.value))}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Ramos disponibles */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Ramos disponibles</h2>
          <ul className="space-y-2">
            {ramos.map((r) => (
              <li key={r.codigo} className="flex justify-between items-center">
                <span>{r.nombre}</span>
                <div className="flex space-x-2">
                  <Button size="xs" color="gray" onClick={() => moveCourse(r, "ramos", "priority")}>
                    Priorizar
                  </Button>
                  <Button size="xs" color="gray" onClick={() => moveCourse(r, "ramos", "postponed")}>
                    Postergar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Prioridad */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Prioridad</h2>
          <ul className="space-y-2">
            {priority.map((r) => (
              <li key={r.codigo} className="flex justify-between items-center">
                <span>{r.nombre}</span>
                <Button size="xs" color="purple" onClick={() => moveCourse(r, "priority", "ramos")}>
                  Volver
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Postergados */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Postergados</h2>
          <ul className="space-y-2">
            {postponed.map((r) => (
              <li key={r.codigo} className="flex justify-between items-center">
                <span>{r.nombre}</span>
                <Button size="xs" color="red" onClick={() => moveCourse(r, "postponed", "ramos")}>
                  Volver
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="text-center">
        <Button color="purple" onClick={() => alert("Volviendo a Home")}>
          Volver
        </Button>
      </div>
    </div>
  );
}

export default MainForm;
