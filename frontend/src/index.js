import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
import MainForm from "./components/MainForm";
import Ranking from "./components/Ranking"
import "flowbite";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/AdminHome" element={<AdminHome />} />
      <Route path="/MainForm" element={<MainForm />} />
      <Route path="/Ranking" element={<Ranking />} />
    </Routes>
  </BrowserRouter>
);
