import React from "react";

export default function RamoForm({ ramo, children, color }) {

  // paleta fija
  const colors = {
    red: {
      bg: "bg-red-100",
      border: "border-red-200",
      text: "text-red-800"
    },
    green: {
      bg: "bg-green-100",
      border: "border-green-200",
      text: "text-green-800"
    },
    default: {
      bg: "bg-blue-50/40",
      border: "border-blue-100",
      text: "text-blue-800"
    }
  };

  // si color no existe → usa azul
  const palette = colors[color] || colors.default;

  return (
    <article
      className={`
        p-4 
        rounded-xl 
        border 
        ${palette.border}
        ${palette.bg}
        transition-colors
      `}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className={`font-semibold text-sm ${palette.text}`}>
            {ramo.nombre}
          </h3>

          <div className={`text-xs ${palette.text} tracking-wide`}>
            {ramo.codigo}
          </div>

          {ramo.creditos !== undefined && (
            <div className={`text-xs ${palette.text}`}>
              {ramo.creditos} créditos
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {children}
        </div>
      </div>
    </article>
  );
}
