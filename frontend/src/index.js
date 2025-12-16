import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import MainForm from "./pages/MainForm";
import Ranking from "./pages/Ranking";
import SimulRamos from "./components/SimulRamos";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import "flowbite";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/MainForm" element={<MainForm />} />
          <Route path="/Ranking" element={<Ranking />} />

          <Route element={<ProtectedAdminRoute/>}>
            <Route path="/AdminHome" element={<AdminHome />} />
          </Route>


        </Route>

      </Routes>
    </BrowserRouter>
  </Provider>
);
