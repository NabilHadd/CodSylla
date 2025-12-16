import React from "react";
import PrintedSem from "./PrintedSem";

export default function PrintedPlan({ planificacion}) {
  return (
    <div
      className="
        flex
        gap-6
        overflow-x-auto
        p-4
        bg-white
        rounded-lg
        border-2 border-blue-500
      "
    >
      {planificacion.map((semestr, i) => (
        <PrintedSem
          key={i}
          sem={semestr}
        />
      ))}
    </div>
  );
}
