import React, { useState } from "react";
import RamoForm from "./RamoForm";

export default function Nivel({ramos, moveCourse, disponibles}) {
  const [openNivel, setOpenNivel] = useState({});
  const ramosPorNivel = ramos.reduce((acc, ramo) => {
    if (!acc[ramo.nivel]) acc[ramo.nivel] = [];
    acc[ramo.nivel].push(ramo);
    return acc;
  }, {});


  const toggleNivel = (nivel) => {
    setOpenNivel((prev) => ({ ...prev, [nivel]: !prev[nivel] }));
  };


  return (
        <>
          {Object.keys(ramosPorNivel).map((nivel) => (
            <div key={nivel} className="rounded-2xl border border-blue-400 mb">
              <button
                onClick={() => toggleNivel(nivel)}
                className="w-full rounded-2xl text-left p-4 bg-blue-100 hover:bg-blue-400 text-blue-900 transition-colors font-semibold"
              >
                Nivel {nivel}
              </button>

              {/* Si el nivel está abierto, mostrar sus ramos */}
              {openNivel[nivel] && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
                  {ramosPorNivel[nivel].map((r) => (
                    <RamoForm key={r.codigo} ramo={r}>
                      <button
                        onClick={() => moveCourse(r, "ramos", "priority")}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:brightness-95"
                      >
                        Priorizar
                      </button>

                      <button
                        onClick={() => moveCourse(r, "ramos", "reprobed")}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-rose-100 text-rose-700 hover:brightness-95"
                      >
                        Reprobar
                      </button>

                      {disponibles.includes(r.codigo) && (
                        <button
                          onClick={() => moveCourse(r, "ramos", "postponed")}
                          className="px-3 py-1 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-700 hover:brightness-95"
                        >
                          Postergar
                        </button>

                        
                      )}
                    </RamoForm>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>

  );
}
