// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  rol: localStorage.getItem("rol"),
  isAdmin: localStorage.getItem("isAdmin") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, rol, admin } = action.payload;

      state.token = token;
      state.rol = rol ?? null;
      state.isAdmin = admin;

      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", admin ? "true" : "false");
      if (rol) localStorage.setItem("rol", rol);
    },
    logout: (state) => {
      state.token = null;
      state.rol = null;
      state.isAdmin = false;

      localStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
