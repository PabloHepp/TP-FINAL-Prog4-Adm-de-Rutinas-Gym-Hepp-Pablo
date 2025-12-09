// este archivo define el componente principal de la aplicación React.
// Utiliza Material-UI para el diseño y los elementos de la interfaz de usuario.
// Configura un tema personalizado para la aplicación.
// Incluye una barra de navegación con un botón de inicio y el título de la aplicación.
// Utiliza React Router para manejar la navegación entre diferentes páginas.
// Proporciona un contenedor principal para renderizar las páginas hijas según la ruta actual.

import { AppBar, Box, Button, Container, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, Outlet } from "react-router-dom";

import theme from "@/theme";
import { useAuth } from "@/context/AuthContext";

function App() {
  const { user, logout } = useAuth();

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
            {user && (
              <Box
                sx={{
                  position: "absolute",
                  right: (theme) => theme.spacing(1),
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                  {user.nombre}
                </Typography>
                <Button variant="outlined" color="inherit" size="small" onClick={logout}>
                  Cerrar sesión
                </Button>
              </Box>
            )}
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
