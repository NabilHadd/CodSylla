import React from "react";

export default function Header({ setMenuOpen, title, children }) {
  return (
    <header
      className="
        flex items-center justify-between
        px-4 py-3
        sticky top-0 z-30

        bg-blue-50/70 backdrop-blur-md
        border-b border-blue-200
        shadow-sm
      "
    >
      <div className="flex items-center gap-3">
        <button
          aria-label="menu"
          onClick={() => setMenuOpen(true)}
          className="
            p-2 rounded-lg
            hover:bg-blue-100
            transition
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-blue-700">
          {title}
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {children}
      </div>
    </header>
  );
}
