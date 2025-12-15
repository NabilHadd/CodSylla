import React from "react";
import { Button } from "flowbite-react";
import { HiChevronDown, HiChevronUp, HiX } from "react-icons/hi";
import Plan from "./Planificacion/PLan";

export default function RankingBar({
  planes,
  moveUp,
  moveDown,
  mostrarPlan,
  planificacion,
  semestre,
  handleCerrar,
  planSelect,
  handleDelete
}) {

const getRankingColor = (rank) => {
  switch (Number(rank)) {
    case 1:
      return "bg-amber-200/40 hover:bg-amber-300/50 border-amber-500 text-amber-700";
    case 2:
      return "bg-orange-200/40 hover:bg-orange-300/50 border-orange-500 text-orange-700";
    case 3:
      return "bg-emerald-200/40 hover:bg-emerald-300/50 border-emerald-500 text-emerald-700";
    default:
      return "bg-blue-200/40 hover:bg-blue-300/50 border-blue-500 text-blue-700";
  }
};



  return (
    <div>
      {planes.length > 0 ? (
        planes.map((plan, i) => {
          const isSelected = planSelect && planSelect.ranking === plan.ranking;

          // Vista expandida
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

          // Vista normal
          return (
            <div
              key={i}
              className={`mb-4 rounded-xl shadow-md border ${getRankingColor(
                plan.ranking
              )} p-4 flex items-center justify-between transition`}
            >
              <div className="font-semibold text-lg text-slate-800">
                {plan.nombre_plan ?? "Plan sin nombre"}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">{plan.ranking}</span>

                <Button
                  color="light"
                  size="xs"
                  pill
                  onClick={() => moveUp(i)}
                  title="Subir"
                >
                  <HiChevronUp className="h-4 w-4" />
                </Button>

                <Button
                  color="light"
                  size="xs"
                  pill
                  onClick={() => moveDown(i)}
                  title="Bajar"
                >
                  <HiChevronDown className="h-4 w-4" />
                </Button>

                <Button
                  color="light"
                  size="xs"
                  pill
                  onClick={() => mostrarPlan(plan)}
                >
                  Mostrar
                </Button>
                {plan.ranking > 1 && (
                  <Button
                    color="light"
                    size="xs"
                    pill
                    onClick={() => handleDelete(plan)}
                  >
                    Eliminar
                  </Button>
                )}
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
