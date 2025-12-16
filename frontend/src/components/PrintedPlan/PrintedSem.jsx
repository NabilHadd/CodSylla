import React from "react";
import PrintedRamo from "./PrintedRamo";

export default function PrintedSem({ sem }) {

  const formatSemestre = (sem) => {
    const year = sem.slice(0, 4);
    const code = sem.slice(4);
    return `${year}-${code}`;
  };

  return (
    <div
      className="
        w-fit
        rounded-lg
        border border-blue-300
        bg-blue-50
        flex flex-col
      "
    >
      {/* Header */}
      <div
        className="
          px-2 py-1
          text-xs
          font-semibold
          text-center
          bg-blue-100
          border-b border-blue-300
          leading-tight
          whitespace-nowrap
        "
      >
        {formatSemestre(sem.sem)}
      </div>

      {/* Ramos */}
      <div className="p-2 flex flex-col gap-1.5">
        {sem.ramos.map((ramo, i) => (
          <PrintedRamo key={i} r={ramo} />
        ))}
      </div>
    </div>
  );
}
