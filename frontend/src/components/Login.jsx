import React, { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import axios from "axios";
import logo from "../assets/codsylla.png";
import { useNavigate } from "react-router-dom";
import {Loading, Toast} from "./Utils/index"
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {setToken} = useAuth();
  const {getBaseUrl} = useApi();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    try {

      const res = await axios.post(`${getBaseUrl()}/auth/login`, {
        email,
        password,
      });

      const { success, admin, token, rol } = res.data;

      if(!success){
        setTimeout(() => setMensaje("Error: " + (res.data.message || "Login fallido")), 0);
        setLoading(false);
        return;
      }

      setToken({admin, token, rol});
      admin ? navigate('/AdminHome') : navigate('/home')

    } catch (err) {
      setTimeout(() => setMensaje("Error: " + (err.response?.data?.message || err.message)), 0);
      setLoading(false)
    }
    
  };



  if (loading) return <Loading mensaje="Autenticando"/>



  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-500 to-blue-900 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
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
            <Label htmlFor="email" value="Correo electrónico" />
            <TextInput
              id="email"
              type="email"
              placeholder="Ingresa tu correo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password" value="Contraseña" />
            <TextInput
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-700 text-blue-700 font-bold rounded-xl hover:from-blue-200 hover:to-blue-300 hover:shadow-lg transition-all duration-300"
          >
            Iniciar sesión
          </Button>

        </form>
      </div>
        
        {/* Mensaje */}
        {mensaje && (
          <Toast message={mensaje} type="error"/>
        )}
    </div>
  );

}

export default Login;
