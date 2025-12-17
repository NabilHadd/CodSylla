import React, {useState} from "react";
import { IColor, Ramo } from "../index";

export default function Semestre({sem, semActual}){
    const [openSemestres, setOpenSemestres] = useState({});

    const formatSemestre = (sem) => {
        const year = sem.slice(0, 4);
        const code = sem.slice(4);
        const isActual = Number(sem) === semActual;
        const suffix = isActual ? ' (Semestre Actual)' : '';

        switch (code) {
            case "10":
            return `${year} - Primer semestre${suffix}`;
            case "20":
            return `${year} - Segundo semestre${suffix}`;
            case "15":
            return `${year} - Verano${suffix}`;
            case "25":
            return `${year} - Invierno${suffix}`;
            default:
            return `${year} - Semestre desconocido${suffix}`;
        }
    };

    const getSemestreColor = (sem) => {
      switch (Number(sem)) {
        case Number(semActual):
          return IColor.YELLOW;
        default:
          return IColor.BLUE;
      }
    };

    const toggleSemestre = (sem) => {
        setOpenSemestres((prev) => ({ ...prev, [sem]: !prev[sem] }));
    };


    return(
    <div
        className={`rounded-2xl border border-${getSemestreColor(sem.sem)}-400 overflow-hidden`}
    >
        <button
        onClick={() => toggleSemestre(sem.sem)}
        className={`w-full text-left p-4 bg-${getSemestreColor(sem.sem)}-100 hover:bg-${getSemestreColor(sem.sem)}-400 text-blue-900 transition-colors font-semibold text-lg`}
        >
        {formatSemestre(sem.sem)}
        </button>


    
        {openSemestres[sem.sem] && (
        <div className={`p-4 bg-${getSemestreColor(sem.sem)}-50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch`}>
            {sem.ramos.map((ramo, j) => (
            <div key={j}>
                <Ramo r={ramo} />
            </div>
            ))}
        </div>
        )}

    </div>)
}