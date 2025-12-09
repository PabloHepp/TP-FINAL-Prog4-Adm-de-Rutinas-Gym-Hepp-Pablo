// este archivo es el punto de entrada principal de la aplicación React.
// Configura el proveedor de React Query para la gestión del estado de datos asíncronos.
// Configura el proveedor de React Router para manejar la navegación entre páginas.
// Renderiza la aplicación dentro del elemento raíz del DOM.

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import router from "@/routes/AppRouter";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
