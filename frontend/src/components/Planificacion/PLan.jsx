import React from "react";
import Semestre from "./Semestre";


export default function Plan({planificacion, semestreActual}) {

  return (
          <div className="space-y-4 max-w-3xl mx-auto p-4 bg-white rounded-lg border-2 border-blue-500">
            {planificacion.map((semestr, i) => (
              
              <div key={i}>
                <Semestre sem={semestr} semActual={semestreActual} />
              </div>
            ))}
          </div>

  );
}
