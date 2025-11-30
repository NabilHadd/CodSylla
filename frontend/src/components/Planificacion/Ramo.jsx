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
        className={`p-2 rounded-xl h-full shadow flex flex-col justify-between ${getRamoColor(r.estado)}`}
      >
          <div>
              <p className="text-sm"><strong>{r.nombre}</strong></p>
              <p className="text-sm">{r.estado.toUpperCase() ?? "Sin estado"}</p>
          </div>

          <div className="flex flex-col">
              <p className="text-xs">{r.codigo?.toUpperCase() ?? "Sin Codigo"}</p>
              <p className="text-xs">{r.creditos ?? "0"}</p>
          </div>
      </div>
    )
}