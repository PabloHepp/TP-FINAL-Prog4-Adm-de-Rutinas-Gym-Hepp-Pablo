//este archivo define la página de inicio de sesión para la aplicación.
//Proporciona formularios para que los usuarios inicien sesión o se registren.
//Maneja la validación de entradas y muestra mensajes de error apropiados.
//Utiliza el contexto de autenticación para gestionar el estado del usuario.

import { useState } from "react";

import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Collapse,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { NorthAxe } from "@/components/north";

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 20;

const formatAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) {
      return detail[0].msg;
    }
  }
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
};

function LoginPage() {
  const { user, login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = ((location.state as { from?: { pathname?: string } } | null)?.from?.pathname) ?? "/";

  const [loginFields, setLoginFields] = useState({ email: "", password: "" });
  const [registerFields, setRegisterFields] = useState({ nombre: "", email: "", password: "" });
  const [showRegister, setShowRegister] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);

    if (!loginFields.email || !loginFields.password) {
      setLoginError("Completá email y contraseña.");
      return;
    }

    if (
      loginFields.password.length < MIN_PASSWORD_LENGTH ||
      loginFields.password.length > MAX_PASSWORD_LENGTH
    ) {
      setLoginError(`La contraseña debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    setIsLoginSubmitting(true);
    try {
      await login(loginFields);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setLoginError(formatAxiosError(err));
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterError(null);

    if (!registerFields.nombre || !registerFields.email || !registerFields.password) {
      setRegisterError("Completá todos los campos para registrarte.");
      return;
    }

    if (
      registerFields.password.length < MIN_PASSWORD_LENGTH ||
      registerFields.password.length > MAX_PASSWORD_LENGTH
    ) {
      setRegisterError(`La contraseña debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    setIsRegisterSubmitting(true);
    try {
      await registerUser(registerFields);
      navigate("/", { replace: true });
    } catch (err) {
      setRegisterError(formatAxiosError(err));
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 20%, #13233a 0%, #0b1421 70%)",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Stack spacing={4} alignItems="center">
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, md: 3, lg: 6 },
          }}
        >
          <Box sx={{ display: { xs: "none", md: "flex" }, flex: "0 0 auto" }}>
            <NorthAxe side="left" />
          </Box>

          <Paper
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: 420,
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(155deg, rgba(8, 15, 28, 0.96), rgba(20, 34, 54, 0.92))",
              border: "1px solid rgba(146, 173, 196, 0.35)",
              color: "#f4f7fb",
              "&::before": {
                content: "''",
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, rgba(255,255,255,0.12), transparent)",
                opacity: 0.6,
                pointerEvents: "none",
              },
            }}
          >
            <Stack spacing={3} component="form" onSubmit={handleLoginSubmit} sx={{ position: "relative", zIndex: 1 }}>
          <div>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{ color: "#f7f9ff", fontWeight: 700, letterSpacing: "0.08em" }}
            >
              Iniciar sesión
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(240, 247, 255, 0.75)" }}>
              Accedé a tu administrador de rutinas.
            </Typography>
          </div>

          {loginError && <Alert severity="error">{loginError}</Alert>}

          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={loginFields.email}
            onChange={(event) => setLoginFields((prev) => ({ ...prev, email: event.target.value }))}
            required
            fullWidth
            InputProps={{
              sx: {
                color: "#f7f9ff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9cc4ff",
                },
              },
            }}
            InputLabelProps={{ sx: { color: "rgba(247,249,255,0.7)" } }}
          />
          <TextField
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={loginFields.password}
            onChange={(event) => setLoginFields((prev) => ({ ...prev, password: event.target.value }))}
            required
            fullWidth
            InputProps={{
              sx: {
                color: "#f7f9ff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9cc4ff",
                },
              },
            }}
            InputLabelProps={{ sx: { color: "rgba(247,249,255,0.7)" } }}
          />

          <Button type="submit" variant="contained" disabled={isLoginSubmitting}>
            {isLoginSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>

          <Box>
            <Button
              variant="text"
              onClick={() => setShowRegister((prev) => !prev)}
              sx={{ color: "#9cc4ff", fontWeight: 600 }}
            >
              {showRegister ? "Ya tengo una cuenta" : "Crear un nuevo usuario"}
            </Button>
          </Box>
            </Stack>
          </Paper>

          <Box sx={{ display: { xs: "none", md: "flex" }, flex: "0 0 auto" }}>
            <NorthAxe side="right" />
          </Box>
        </Box>

        <Collapse in={showRegister} unmountOnExit>
          <Paper
            component="form"
            onSubmit={handleRegisterSubmit}
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: 560,
              p: { xs: 3, md: 4 },
              background: "linear-gradient(155deg, rgba(9, 16, 28, 0.96), rgba(19, 31, 49, 0.9))",
              border: "1px solid rgba(146, 173, 196, 0.35)",
              color: "#f5f8ff",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Crear usuario
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(240, 247, 255, 0.75)" }} gutterBottom>
              Registrate completando tus datos. El usuario quedará creado inmediatamente.
            </Typography>

            {registerError && <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>}

            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={registerFields.nombre}
                onChange={(event) => setRegisterFields((prev) => ({ ...prev, nombre: event.target.value }))}
                required
                fullWidth
                InputProps={{
                  sx: {
                    color: "#f7f9ff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.25)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9cc4ff",
                    },
                  },
                }}
                InputLabelProps={{ sx: { color: "rgba(247,249,255,0.7)" } }}
              />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                value={registerFields.email}
                onChange={(event) => setRegisterFields((prev) => ({ ...prev, email: event.target.value }))}
                required
                fullWidth
                InputProps={{
                  sx: {
                    color: "#f7f9ff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.25)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9cc4ff",
                    },
                  },
                }}
                InputLabelProps={{ sx: { color: "rgba(247,249,255,0.7)" } }}
              />
              <TextField
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                value={registerFields.password}
                onChange={(event) => setRegisterFields((prev) => ({ ...prev, password: event.target.value }))}
                required
                fullWidth
                InputProps={{
                  sx: {
                    color: "#f7f9ff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.25)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9cc4ff",
                    },
                  },
                }}
                InputLabelProps={{ sx: { color: "rgba(247,249,255,0.7)" } }}
              />
              <Button type="submit" variant="outlined" disabled={isRegisterSubmitting}>
                {isRegisterSubmitting ? "Creando..." : "Crear cuenta"}
              </Button>
            </Stack>
          </Paper>
        </Collapse>
      </Stack>
    </Box>
  );
}

export default LoginPage;
