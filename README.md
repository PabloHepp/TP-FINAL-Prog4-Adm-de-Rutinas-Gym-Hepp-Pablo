## Sistema de Gestión de Rutinas de Gimnasio

Proyecto full-stack para Programación 4 (UTN) que permite administrar rutinas de entrenamiento con un backend FastAPI + SQLModel y un frontend React + Vite.

## Estructura del repositorio

- `backend/`: API FastAPI (SQLModel, Alembic, autenticación JWT).
- `frontend/`: SPA React/Vite + Material UI.
- `docker-compose.yaml`: orquestación simple para levantar todo el stack.
- `.github/`: instrucciones personalizadas y automatizaciones.

## Requisitos previos para la ejecución con Docker

- Docker Desktop o Docker Engine + Docker Compose Plugin (`docker compose` ≥ v2).
- 4 GB de RAM disponibles (aprox.)
- Puertos libres: `8000` (API) y `5173` (Frontend).

## Pasos para ejecutar con Docker

1. Clonar el repositorio y ubicarse en la raíz del proyecto.
2. Construir las imágenes (backend + frontend):
	```powershell
	docker compose build
	```
3. Levantar los servicios en segundo plano:
	```powershell
	docker compose up -d
	```
4. Verificar que ambos contenedores estén “healthy”:
	```powershell
	docker compose ps
	```

### Servicios levantados

| Servicio  | Puerto host | Imagen base       | Descripción |
|-----------|-------------|-------------------|-------------|
| backend   | `8000`      | `python:3.11-slim`| FastAPI + SQLite + JWT |
| frontend  | `5173`      | `node:18`         | React + Vite (build + preview) |

### Variables y volúmenes clave

- `SECRET_KEY=unaClaveSegura123`
- `DATABASE_URL=sqlite:///./app.db` (persistido con bind mount `./backend/app.db:/app/app.db`)
- `VITE_API_URL=http://localhost:8000`

### Comprobaciones rápidas

- Frontend: `http://localhost:5173`
- API Health: `http://localhost:8000/health`
- Swagger: `http://localhost:8000/docs`

Para detener los servicios:
```powershell
docker compose down
```

> El archivo `backend/app.db` queda fuera de los contenedores, por lo que los datos persisten entre ejecuciones.

## Ejecución manual (sin Docker)

- Seguir las guías de `backend/README.md` y `frontend/README.md` para levantar cada parte con Python/Node locales.
- Configurar `DATABASE_URL` (PostgreSQL o SQLite) y `VITE_API_URL` según el entorno.

## Características principales

- CRUD de rutinas y ejercicios, con filtros y duplicado de rutinas.
- Autenticación con JWT (registro, login, `/auth/me`).
- Tema visual inspirado en el norte de Westeros (Material UI personalizado).
- Exportadores y vistas protegidas (React Router, ProtectedRoute).

## Créditos

Trabajo práctico final – Programación 4, UTN FRT. Desarrollo por Pablo Hepp.
