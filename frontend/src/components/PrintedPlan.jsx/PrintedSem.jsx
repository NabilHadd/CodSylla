export default function PrintedSem({ sem }) {

  const formatSemestre = (sem) => {
    const year = sem.slice(0, 4);
    const code = sem.slice(4);
    return `${year} - ${code}`;
  };

  return (
    <div
      className="
        min-w-[190px]
        rounded-xl
        border border-blue-300
        bg-blue-50
        flex flex-col
      "
    >
      {/* Header del semestre */}
      <div
        className="
          p-2
          text-sm
          font-semibold
          text-center
          bg-blue-100
          border-b border-blue-300
        "
      >
        {formatSemestre(sem.sem)}
      </div>

      {/* Ramos */}
      <div className="p-2 flex flex-col gap-1.5 text-xs">
        {sem.ramos.map((ramo, i) => (
          <PrintedRamo key={i} r={ramo} />
        ))}
      </div>
    </div>
  );
}
