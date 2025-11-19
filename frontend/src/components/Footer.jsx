import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-300 py-4 mt-10">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} CodSylla — Todos los derechos reservados.
        </p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <p className="hover:text-blue-600 transition">Privacidad</p>
          <p className="hover:text-blue-600 transition">Términos</p>
          <p className="hover:text-blue-600 transition">Contacto</p>
        </div>

      </div>
    </footer>
  );
}
