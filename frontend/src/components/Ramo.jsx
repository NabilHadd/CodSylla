import React from "react";

export default function Ramo({r}){
    
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

    return(
        <div
            className={`p-2 rounded-xl h-full shadow ${getRamoColor(
            r.estado
            )} `}
        >
            <p><strong>{r.nombre}</strong></p>
            <p>{r.estado.toUpperCase() ?? "Sin estado"}</p>
        </div>)
}