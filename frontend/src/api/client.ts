// este archivo configura un cliente API utilizando Axios para realizar solicitudes HTTP a la API backend.
// Define la URL base de la API y los encabezados predeterminados para las solicitudes.
// Este cliente se utiliza en otros módulos para interactuar con los endpoints de la API.
// Facilita la gestión de las solicitudes y respuestas HTTP en la aplicación frontend.
// Permite una configuración centralizada para manejar aspectos como autenticación, manejo de errores y tiempos de espera.


import axios from "axios";

import { AUTH_TOKEN_KEY } from "@/constants/auth";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setApiClientAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

const bootstrapToken = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
if (bootstrapToken) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${bootstrapToken}`;
}

export default apiClient;
