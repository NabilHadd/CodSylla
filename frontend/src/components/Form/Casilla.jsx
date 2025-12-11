import React from "react";
import RamoForm from "./RamoForm";
import { Card } from "flowbite-react";

export default function Casilla({type, array, moveCourse, from}) {
 
    return (
        <Card className="rounded-2xl shadow-lg bg-white/90">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-blue-700">{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</h3>
                <div className="text-sm text-slate-500">{array.length}</div>
            </div>
        
            <div className="flex flex-col gap-3">
                {array.length === 0 && <div className="text-slate-500">No hay ramos {type}</div>}
        
                <div className="grid grid-cols-1 gap-3">
                {array.map((r) => (
                    <RamoForm key={r.codigo} ramo={r}>
                        <button onClick={() => moveCourse(r, from, "ramos")} className="px-3 py-1 rounded-md text-sm bg-white border border-green-200">
                            Volver
                        </button>
                    </RamoForm>
                ))}
                </div>
            </div>
        </Card>
    );
}
