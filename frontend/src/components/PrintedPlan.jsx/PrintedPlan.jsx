import React from "react";
import PrintedSem from "./PrintedSem";

export default function PrintedPlan({ planificacion }) {
  return (
    <div
      className="
        flex
        flex-col
        p-[0.3cm]
        box-border
        w-[calc(100%-0.6cm)]
      "
    >
      <h1
        className="
          mt-2
          mb-3
          text-lg
          font-bold
          text-center
          text-blue-700
          tracking-wide
        "
      >
        Planificación Académica
      </h1>

      <div
        className="
          flex
          justify-start
          items-start
          gap-1
        "
      >
        {planificacion.map((semestr, i) => (
          <PrintedSem key={i} sem={semestr} />
        ))}
      </div>
    </div>
  );
}
