import React from "react";

export default function Footer() {
  return (
    <footer
      className="
        w-full mt-12
        bg-gradient-to-b from-neutral-900 to-black
        border-t border-neutral-800
      "
    >
      <div
        className="
          max-w-6xl mx-auto px-6 py-6
          flex flex-col md:flex-row
          items-center justify-between
          gap-4
          text-neutral-400 text-sm
        "
      >
        {/* Left */}
        <div className="text-center md:text-left space-y-1">
          <p className="font-medium text-neutral-200">
            © {new Date().getFullYear()} CodSylla
          </p>
          <p className="text-neutral-400">
            Desarrollado por el Departamento de Ingeniería — Universidad Católica del Norte
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/USUARIO/REPO"
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-blue-400
              hover:text-blue-300
              transition-colors
            "
          >
            GitHub del proyecto
          </a>
        </div>
      </div>
    </footer>
  );
}
