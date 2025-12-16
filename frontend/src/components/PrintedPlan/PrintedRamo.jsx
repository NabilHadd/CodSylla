import React from "react";

export default function PrintedRamo({ r }) {

  const getRamoColor = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "aprobado":
        return "bg-green-200 text-green-900 border-green-400";
      case "reprobado":
        return "bg-red-200 text-red-900 border-red-400";
      case "pendiente":
        return "bg-blue-200 text-blue-900 border-blue-400";
      default:
        return "bg-gray-200 text-gray-900 border-gray-400";
    }
  };

  return (
    <div
      className={`
        p-2
        rounded-md
        border
        flex flex-col
        gap-1
        leading-tight
        ${getRamoColor(r.estado)}
      `}
    >
      {/* Nombre */}
      <p className="text-xs font-semibold break-words whitespace-normal">
        {r.nombre}
      </p>

      {/* Estado */}
      <p className="text-[10px] uppercase">
        {r.estado ?? "Sin estado"}
      </p>

      {/* Código + créditos */}
      <div className="flex justify-between text-[10px]">
        <span className="break-all">
          {r.codigo ?? "—"}
        </span>
        <span>
          {r.creditos ?? 0} cr
        </span>
      </div>
    </div>
  );
}
