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
      main: "#6da9ff",
      light: "#9cc4ff",
      dark: "#1c3f63",
      contrastText: "#061120",
    },
    secondary: {
      main: "#1f2e43",
      contrastText: "#f4f7fb",
    },
    text: {
      primary: "#f4f7fb",
      secondary: "#a9b6c7",
    },
    background: {
      default: "#0b1421",
      paper: "rgba(23, 36, 55, 0.95)",
    },
  },
  typography: {
    fontFamily: "'Cinzel', serif",
    h4: { letterSpacing: "0.08em", textTransform: "uppercase" },
    h5: { fontWeight: 600, letterSpacing: "0.08em" },
    button: { letterSpacing: "0.08em" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0b1421",
          color: "#f4f7fb",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 500,
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 10px 22px rgba(4, 11, 22, 0.45)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(146, 173, 196, 0.35)",
          backgroundImage: "linear-gradient(145deg, rgba(11, 20, 33, 0.95), rgba(23, 36, 55, 0.85))",
          boxShadow: "0 22px 45px rgba(4, 10, 18, 0.65)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(146, 173, 196, 0.35)",
          backgroundImage: "linear-gradient(165deg, rgba(18, 30, 45, 0.95), rgba(10, 18, 28, 0.85))",
          boxShadow: "0 18px 36px rgba(1, 5, 12, 0.75)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: "rgba(157, 186, 210, 0.5)",
          color: "#d5e2f3",
          backgroundColor: "rgba(157, 186, 210, 0.08)",
        },
      },
    },
  },
});

export default theme;