// este archivo define el tema personalizado para la aplicación utilizando Material-UI.
// Configura la paleta de colores primaria y secundaria.
// Establece los colores de fondo predeterminados para la aplicación.
// Define la tipografía general utilizada en toda la interfaz de usuario.
// Permite una apariencia coherente y personalizada en todos los componentes de la aplicación.

import { createTheme } from "@mui/material/styles";

// Tema base: define paleta y tipografía general de la app.
const theme = createTheme({
  palette: {
    primary: {
      main: "#00796b",
    },
    secondary: {
      main: "#ff7043",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
  },
});

export default theme;
