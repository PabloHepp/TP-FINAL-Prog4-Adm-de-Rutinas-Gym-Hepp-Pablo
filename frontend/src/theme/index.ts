// este archivo define el tema personalizado para la aplicación utilizando Material-UI.
// Configura la paleta de colores primaria y secundaria.
// Establece los colores de fondo predeterminados para la aplicación.
// Define la tipografía general utilizada en toda la interfaz de usuario.
// Permite una apariencia coherente y personalizada en todos los componentes de la aplicación.

import { createTheme } from "@mui/material/styles";

// Definición del tema personalizado
// Configuración de la paleta de colores, tipografía y componentes

const theme = createTheme({ // Tema personalizado para la aplicación
  palette: {
    primary: {
      main: "#3f72ff",
      light: "#6f92ff",
      dark: "#3159cc",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1d1f24",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#1d1f24",
      secondary: "#5f6470",
    },
    background: {
      default: "#f4f6fb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: { fontWeight: 600 },
    body1: { color: "#5f6470" },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;