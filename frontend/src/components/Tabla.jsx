import React, { useMemo, useState } from "react";

export default function Tabla({
  title,
  columns,
  data,
  rowMapper,
  summary,
  filtro,
  filtroSem,
  limite
}) {
  const maxRows = data.length;
  const semestres = Array.from({ length: 6 }, (_, i) => {
    const year = filtroSem?.actualSem+ i;
    return [
        { value: `${year}10`, label: `Primer semestre ${year}` },
        { value: `${year}20`, label: `Segundo semestre ${year}` },
    ];
  }).flat();


  const [visibleRows, setVisibleRows] = useState(maxRows);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === "asc"
        ? aVal - bVal
        : bVal - aVal;
    });
  }, [data, sortConfig]);

  const slicedData = useMemo(() => {
    if (!limite) return sortedData;
    return sortedData.slice(0, visibleRows);
  }, [sortedData, visibleRows, limite]);

  return (
    <section className="bg-white rounded-2xl shadow border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>

        <div className="flex items-center gap-3">
          {filtro && (
            <>
              <span className="text-sm text-slate-600">Carreras:</span>
              <select
                value={filtro.filter}
                onChange={(e) => filtro.setter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                {filtro.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {limite && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Mostrar:</span>
              <input
                type="number"
                min={1}
                max={maxRows}
                value={visibleRows}
                onChange={(e) =>
                  setVisibleRows(
                    Math.min(maxRows, Math.max(1, Number(e.target.value)))
                  )
                }
                className="w-20 border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span>de {maxRows}</span>
            </div>
          )}
            {filtroSem && (
            <>
                <span className="text-sm text-slate-600">Semestre:</span>
                <select
                value={filtroSem.filter}
                onChange={(e) => filtroSem.setter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                {semestres.map((s) => (
                    <option key={s.value} value={s.value}>
                    {s.label}
                    </option>
                ))}
                </select>
            </>
            )}

          {summary && (
            <span className="text-sm font-medium text-slate-500">
              {summary}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left text-sm text-slate-600 uppercase tracking-wide">
              {columns.map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-2 cursor-pointer select-none hover:bg-slate-200"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortConfig.key === key && (
                      <span>
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slicedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            ) : (
              slicedData.map((item, i) => rowMapper(item, i))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
