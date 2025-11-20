import React from "react";
import { Spinner } from "flowbite-react";

export default function Loading({ mensaje = "Cargando..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 z-50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <Spinner size="xl" color="purple" className="mb-4" />
        <p className="text-lg font-semibold text-purple-700">{mensaje}</p>
        <p className="text-lg font-semibold text-purple-400">Por favor espere...</p>
      </div>
    </div>
  );
}
