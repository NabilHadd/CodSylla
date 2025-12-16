import React from "react";
import { Button } from "flowbite-react";
import { HiChevronDown, HiChevronUp, HiX } from "react-icons/hi";
import {Plan} from './index'

export default function RankingBar({
  planes,
  moveUp,
  moveDown,
  mostrarPlan,
  planificacion,
  semestre,
  handleCerrar,
  planSelect,
  handleDelete,
  handleDownload
}) {

  const getRankingColor = (rank) => {
    switch (Number(rank)) {
      case 1:
        return "bg-amber-100 border-amber-300 text-amber-800";
      case 2:
        return "bg-orange-100 border-orange-300 text-orange-800";
      case 3:
        return "bg-emerald-100 border-emerald-300 text-emerald-800";
      default:
        return "bg-blue-100 border-blue-300 text-blue-800";
    }
  };

  return (
    <div>
      {planes.length > 0 ? (
        planes.map((plan, i) => {
          
          const isSelected = planSelect && planSelect.ranking === plan.ranking;

          if (isSelected) {

            return (

              <div
                className={`rounded-xl shadow-md border ${getRankingColor(
                  plan.ranking
                )} p-4 flex items-center justify-between transition`}
              >
                <div key={i} className="flex-1 p-6 relative">
                  <Button
                    color="failure"
                    pill
                    size="xs"
                    className="absolute top-4 right-4"
                    onClick={handleCerrar}
                    title="Cerrar"
                  >
                    <HiX className="h-5 w-5" />
                  </Button>

                  <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">
                    Ranking: {plan.nombre_plan}
                  </h1>

                  <Plan planificacion={planificacion} semestreActual={semestre} />
                </div>
              </div>
            );
          }

          return (

            <div
              key={i}
              className={`mb-4 rounded-xl shadow-md border ${getRankingColor(
                plan.ranking
              )} p-4 flex items-center justify-between transition`}
            >

              <div className="flex items-center gap-4">
                {/* Número de ranking */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-gray-400 text-gray-800 font-bold text-base">
                  {plan.ranking}
                </div>

                {/* Nombre del plan */}
                <div className="font-semibold text-lg text-slate-800">
                  {plan.nombre_plan ?? "Plan sin nombre"}
                </div>
              </div>


              {/* Ranking y botones */}
              <div className="flex items-center gap-2">

                <Button
                  color="gray"
                  size="sm"
                  className="p-2 rounded-full hover:bg-gray-200 shadow transition"
                  onClick={() => moveUp(i)}
                  title="Subir"
                >
                  <HiChevronUp className="h-4 w-4" />
                </Button>

                <Button
                  color="gray"
                  size="sm"
                  className="p-2 rounded-full hover:bg-gray-200 shadow transition"
                  onClick={() => moveDown(i)}
                  title="Bajar"
                >
                  <HiChevronDown className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  className="p-2 border-2 border-blue-400 bg-blue-300 hover:bg-blue-400 shadow transition text-blue-800"
                  onClick={() => mostrarPlan(plan)}
                >
                  Mostrar
                </Button>

                {plan.ranking > 1 && (
                  <Button
                    color=''
                    size="sm"
                    className="p-2 border-2 border-red-400 bg-red-300 hover:bg-red-200 shadow transition text-red-800"
                    onClick={() => handleDelete(plan)}
                  >
                    Eliminar
                  </Button>
                )}

                <Button
                  size="sm"
                  className="p-2 border-2 border-green-400 bg-green-300 hover:bg-green-400 shadow transition text-green-800"
                  onClick={() => handleDownload(plan.ranking)}
                >
                  Descargar
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No hay planes disponibles.</p>
      )}
    </div>
  );
}
