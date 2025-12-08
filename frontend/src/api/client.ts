// este archivo configura un cliente API utilizando Axios para realizar solicitudes HTTP a la API backend.
// Define la URL base de la API y los encabezados predeterminados para las solicitudes.
// Este cliente se utiliza en otros módulos para interactuar con los endpoints de la API.
// Facilita la gestión de las solicitudes y respuestas HTTP en la aplicación frontend.
// Permite una configuración centralizada para manejar aspectos como autenticación, manejo de errores y tiempos de espera.


import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
