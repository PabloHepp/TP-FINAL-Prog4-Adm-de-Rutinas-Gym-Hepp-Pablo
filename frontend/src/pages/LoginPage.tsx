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
    <Stack minHeight="100vh" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#f5f5f5", py: 4 }}>
      <Paper elevation={3} sx={{ width: "100%", maxWidth: 420, p: 4 }}>
        <Stack spacing={3} component="form" onSubmit={handleLoginSubmit}>
          <div>
            <Typography variant="h5" component="h1" gutterBottom>
              Iniciar sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
          />
          <TextField
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={loginFields.password}
            onChange={(event) => setLoginFields((prev) => ({ ...prev, password: event.target.value }))}
            required
            fullWidth
          />

          <Button type="submit" variant="contained" disabled={isLoginSubmitting}>
            {isLoginSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>

          <Box>
            <Button variant="text" onClick={() => setShowRegister((prev) => !prev)}>
              {showRegister ? "Ya tengo una cuenta" : "Crear un nuevo usuario"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Collapse in={showRegister} unmountOnExit>
        <Box component="form" onSubmit={handleRegisterSubmit} mt={4}>
          <Typography variant="h6" gutterBottom>
            Crear usuario
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
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
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              value={registerFields.email}
              onChange={(event) => setRegisterFields((prev) => ({ ...prev, email: event.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              value={registerFields.password}
              onChange={(event) => setRegisterFields((prev) => ({ ...prev, password: event.target.value }))}
              required
              fullWidth
            />
            <Button type="submit" variant="outlined" disabled={isRegisterSubmitting}>
              {isRegisterSubmitting ? "Creando..." : "Crear cuenta"}
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Stack>
  );
}

export default LoginPage;
