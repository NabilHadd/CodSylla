import React from "react";
export default function PrintedRamo({ r }) {

  const getRamoColor = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "aprobado":
        return "bg-green-200 text-green-900 border border-green-400";
      case "reprobado":
        return "bg-red-200 text-red-900 border border-red-400";
      case "pendiente":
        return "bg-blue-200 text-blue-900 border border-blue-400";
      default:
        return "bg-gray-200 text-gray-900 border border-gray-400";
    }
  };

  return (
    <div
      className={`
        p-1.5
        rounded-md
        border
        flex flex-col justify-between
        ${getRamoColor(r.estado)}
      `}
    >
      <div className="leading-tight">
        <p className="text-xs font-semibold truncate">
          {r.nombre}
        </p>
        <p className="text-[10px] uppercase">
          {r.estado ?? 'Sin estado'}
        </p>
      </div>

      <div className="leading-tight mt-0.5">
        <p className="text-[10px] truncate">
          {r.codigo ?? 'Sin código'}
        </p>
        <p className="text-[10px]">
          {r.creditos ?? '0'} cr
        </p>
      </div>
    </div>
  );
}
