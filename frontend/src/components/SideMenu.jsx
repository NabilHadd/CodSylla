import React from "react";
import { Button } from "flowbite-react"; // ajusta ruta si es necesario

export default function SideMenu({ setMenuOpen, handleLogout, children}) {

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setMenuOpen(false)}
      />

      <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col">
        <div>
          <h2 className="text-lg font-bold text-blue-700 mb-4">Menú</h2>
          <p className="text-sm text-slate-500 mb-6">Opciones rápidas</p>
        </div>

        <div className="flex flex-col gap-3">
            {children}
        </div>

        <Button
          color="red"
          onClick={() => handleLogout()}
          className="mt-auto"
        >
          Cerrar Sesión
        </Button>
      </aside>
    </div>
  );
}
