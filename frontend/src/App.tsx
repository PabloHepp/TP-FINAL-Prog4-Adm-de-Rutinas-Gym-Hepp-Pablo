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
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #e2e8f5 0%, #c9d3e4 65%)",
            color: "#0a1424",
            borderBottom: "1px solid rgba(6, 17, 32, 0.25)",
            boxShadow: "0 8px 18px rgba(6, 11, 21, 0.25)",
          }}
        >
          <Toolbar sx={{ position: "relative", justifyContent: "center", minHeight: { xs: 70, md: 88 } }}>
            <IconButton
              color="inherit"
              component={Link}
              to="/"
              aria-label="Ir al inicio"
              sx={{
                position: "absolute",
                left: (theme) => theme.spacing(1.5),
                color: "#0a1424",
                "&:hover": { color: "#233750" },
              }}
            >
              <HomeIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              textAlign="center"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.45rem" },
                textTransform: "uppercase",
                color: "#0a1424",
              }}
            >
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
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", sm: "block" }, color: "#1f2d44", fontWeight: 600 }}
                >
                  {user.nombre}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={logout}
                  sx={{
                    color: "#0a1424",
                    borderColor: "rgba(6, 17, 32, 0.45)",
                    "&:hover": { borderColor: "rgba(6, 17, 32, 0.65)" },
                  }}
                >
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
