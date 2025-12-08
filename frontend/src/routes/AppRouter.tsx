// este archivo configura las rutas de la aplicación utilizando React Router.
// Define las rutas principales y las páginas asociadas.
// Utiliza createBrowserRouter para crear un enrutador basado en el historial del navegador.
// Importa los componentes de las páginas que se mostrarán en cada ruta.
// Establece una ruta raíz que carga el componente App y define rutas hijas para las páginas específicas.
// Facilita la navegación dentro de la aplicación React.

import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/pages/Dashboard";
import RutinaDetailPage from "@/pages/RutinaDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "rutinas/:id",
        element: <RutinaDetailPage />,
      },
    ],
  },
]);

export default router;
