import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("doneza_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default api;