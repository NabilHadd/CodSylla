import React, { useState } from "react";
import { Button, Label, TextInput, Card } from "flowbite-react";

function MainForm() {
  const initialCourses = [
    { code: "MAT101", name: "Matemáticas I" },
    { code: "PHY101", name: "Física I" },
    { code: "CS101", name: "Programación I" },
    { code: "ENG101", name: "Inglés I" },
    { code: "HIS101", name: "Historia" },
  ];

  const [nombrePlan, setNombrePlan] = useState("");
  const [maxCredits, setMaxCredits] = useState(32);
  const [courses, setCourses] = useState(initialCourses);
  const [priority, setPriority] = useState([]);
  const [postponed, setPostponed] = useState([]);

  const moveCourse = (course, from, to) => {
    if (from === "courses") setCourses(courses.filter(c => c.code !== course.code));
    if (from === "priority") setPriority(priority.filter(c => c.code !== course.code));
    if (from === "postponed") setPostponed(postponed.filter(c => c.code !== course.code));

    if (to === "courses") setCourses([...courses, course]);
    if (to === "priority") setPriority([...priority, course]);
    if (to === "postponed") setPostponed([...postponed, course]);
  };

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
          onChange={e => setNombrePlan(e.target.value)}
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
          onChange={e => setMaxCredits(Number(e.target.value))}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cursos disponibles */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Cursos disponibles</h2>
          <ul className="space-y-2">
            {courses.map(c => (
              <li key={c.code} className="flex justify-between items-center">
                <span>{c.name}</span>
                <div className="flex space-x-2">
                  <Button size="xs" onClick={() => moveCourse(c, "courses", "priority")}>
                    Priorizar
                  </Button>
                  <Button size="xs" color="gray" onClick={() => moveCourse(c, "courses", "postponed")}>
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
            {priority.map(c => (
              <li key={c.code} className="flex justify-between items-center">
                <span>{c.name}</span>
                <Button size="xs" color="red" onClick={() => moveCourse(c, "priority", "courses")}>
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
            {postponed.map(c => (
              <li key={c.code} className="flex justify-between items-center">
                <span>{c.name}</span>
                <Button size="xs" color="red" onClick={() => moveCourse(c, "postponed", "courses")}>
                  Volver
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="text-center">
        <Button gradientDuoTone="purpleToPink" onClick={() => alert("Volviendo a Home")}>
          Volver
        </Button>
      </div>
    </div>
  );
}

export default MainForm;
