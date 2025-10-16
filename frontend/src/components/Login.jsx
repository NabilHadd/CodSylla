import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/codsylla.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      setMensaje("✅ Login exitoso! Token: " + res.data.token);

      navigate("/Home");
    } catch (err) {
      setMensaje("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Efecto decorativo de fondo */}
      <div className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl top-10 left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-10 right-20 animate-pulse"></div>

      {/* Título principal */}
      <h1 className="text-white text-5xl font-extrabold text-center mb-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
        <span className="text-blue-100">Cod</span>
        <span className="text-white">Sylla</span>
        <p className="text-xl font-light text-blue-200 mt-2">
          Planificación de avance curricular
        </p>
      </h1>

      {/* Contenedor principal */}
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center w-full mb-4">
          <img src={logo} alt="Logo" className="w-52 h-32 rounded-full shadow-md" />
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Inicia sesión
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-700 text-blue-700 font-bold rounded-xl hover:from-blue-200 hover:to-blue-300 hover:shadow-lg transition-all duration-300"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Mensaje */}
        {mensaje && (
          <p
            className={`mt-5 text-center font-medium ${
              mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );

}

export default Login;
