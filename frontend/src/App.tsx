// este archivo define el componente principal de la aplicación React.
// Utiliza Material-UI para el diseño y los elementos de la interfaz de usuario.
// Configura un tema personalizado para la aplicación.
// Incluye una barra de navegación con un botón de inicio y el título de la aplicación.
// Utiliza React Router para manejar la navegación entre diferentes páginas.
// Proporciona un contenedor principal para renderizar las páginas hijas según la ruta actual.

import { AppBar, Box, Container, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, Outlet } from "react-router-dom";

import theme from "@/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar sx={{ position: "relative", justifyContent: "center" }}>
            <IconButton
              color="inherit"
              component={Link}
              to="/"
              aria-label="Ir al inicio"
              sx={{ position: "absolute", left: (theme) => theme.spacing(1) }}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" component="div" textAlign="center">
              Administrador de Rutinas Gym Tormund
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
