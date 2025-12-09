# Frontend - Administrador de Rutinas Gym Tormund

SPA construida con React, Vite y TypeScript para consumir la API del backend y administrar rutinas de entrenamiento.

## Requisitos previos

- Node.js 18 LTS o superior (incluye npm)
- Backend corriendo en `http://localhost:8000` o la URL que expongas

## Instalación y configuración

1. Abrí una terminal en la carpeta `frontend`.
2. Instalá dependencias:
   ```powershell
   npm install
   ```
3. (Opcional) Creá un archivo `.env` si necesitás apuntar a otra URL del backend. Ejemplo:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   Si no definís esta variable, el cliente usará `http://localhost:8000` por defecto.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite en `http://localhost:5173`. Incluye hot reload. |
| `npm run build` | Genera la versión optimizada para producción en `frontend/dist`. |
| `npm run preview` | Sirve el build generado para verificarlo localmente. Ejecutá `npm run build` antes. |

## Notas de uso

- La autenticación almacena el token JWT en `localStorage`. Si necesitás cerrar sesión manualmente, podés borrar la clave `gym-rutinas-token` desde las herramientas del navegador.
- El frontend espera que el backend exponga los endpoints `/auth/*` y `/rutinas/*` tal como se detallan en su README.
- Para presentar el proyecto basta con seguir estos pasos: instalar dependencias, definir (opcionalmente) `VITE_API_URL`, y ejecutar `npm run dev`.
