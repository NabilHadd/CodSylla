import React from "react";
import { Button } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";

export default function RestrictedAcces({error}){
  const {handleLogout} = useAuth();
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6 flex flex-col ">
          <h1 className="text-2xl font-semibold text-slate-900">
            Acceso restringido
          </h1>
          <p className="text-slate-600">
            No podemos mostrar esta sección en este momento. {error}
          </p>
                    <Button color="blue" onClick={() => handleLogout()}>
              Volver al Login
            </Button>
        </div>
      </div>
    );
}