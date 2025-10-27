import React, { useEffect, useState } from "react";

function Home() {
  const [planificacion, setPlanificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/planification/obtener/1")
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
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-blue-500 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">¡Hola Alumno!</h1>

      {planificacion.map((semestre, i) => (
        <div key={i} className="mb-4 p-3 bg-blue-700 rounded w-full max-w-lg">
          <h2 className="font-bold mb-2">Semestre: {semestre.sem}</h2>
          {semestre.ramos.map((ramo, j) => (
            <div key={j} className="mb-1 p-1 bg-blue-600 rounded">
              <strong>{ramo.nombre}</strong> - {ramo.estado ?? "Sin estado"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Home;
