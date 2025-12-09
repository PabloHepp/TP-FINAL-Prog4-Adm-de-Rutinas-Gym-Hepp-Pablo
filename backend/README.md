# Backend - Administrador de Rutinas Gym Tormund

API REST con FastAPI + SQLModel + PostgreSQL que gestiona rutinas y autenticación JWT.

## Requisitos previos

- Python 3.10 o superior
- PostgreSQL 14 o superior (con un usuario con permisos para crear bases)
- PowerShell (Windows) o cualquier terminal equivalente

## Puesta en marcha rápida

1. **Entrar a la carpeta** `backend` y crear el entorno virtual:
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
2. **Instalar dependencias** (notá que el archivo se llama `requeriments.txt`):
   ```powershell
   pip install --upgrade pip
   pip install -r requeriments.txt
   ```
3. **Configurar variables**: copiá `.env.example` a `.env`.

   ```powershell
   copy .env.example .env
   ```

## Configuración de base de datos

El backend usa PostgreSQL. Podés configurar la conexión de dos maneras:

1. **Campos individuales** (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
2. **URL completa** en `DATABASE_URL` (sobrescribe los campos anteriores). Formato recomendado:
   ```env
   DATABASE_URL=postgresql+psycopg://usuario:password@localhost:5432/gym_Tormund
   ```

> Si no cambiás nada, el sistema intentará conectarse a `postgres://postgres:123456@localhost:5432/gym_Tormund`.

### Crear la base de datos

1. Abrí `psql` u otra herramienta y ejecutá:
   ```sql
   CREATE DATABASE gym_Tormund;
   ```
2. En el mismo entorno donde activaste la venv, corré las migraciones de Alembic para crear las tablas:
   ```powershell
   alembic upgrade head
   ```

Si cambiás el nombre/usuario/contraseña de la base, actualizá los valores en `.env` antes de ejecutar Alembic.

## Ejecutar el backend

Con la venv activa y la configuración correcta:

```powershell
uvicorn app.main:app --reload --port 8000
```

- Health-check: `GET http://localhost:8000/health`
- Documentación interactiva: `http://localhost:8000/docs`

## Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/register` | Registra un usuario y genera un hash seguro de contraseña. |
| `POST` | `/auth/login` | Devuelve un JWT para autenticarse desde el frontend. |
| `GET` | `/auth/me` | Obtiene el usuario autenticado (requiere token). |
| `GET` | `/rutinas/` | Lista rutinas con filtros `search` y `dia_semana`. |
| `POST` | `/rutinas/` | Crea una rutina con su lista de ejercicios. |
| `PUT` | `/rutinas/{id}` | Reemplaza la información de la rutina y sus ejercicios. |
| `DELETE` | `/rutinas/{id}` | Elimina una rutina y sus ejercicios asociados. |

Para más ejemplos revisá los esquemas en `app/schemas/` o usá la interfaz de Swagger.

## Estructura clave

- `app/core/config.py`: obtención de settings y armado del `DATABASE_URL`.
- `app/db/session.py`: engine global y dependencias de sesión.
- `app/api/auth.py`: registro/login y validación de tokens.
- `app/api/rutinas.py`: CRUD completo de rutinas/ejercicios.
- `app/models/*`: entidades SQLModel.
- `alembic/versions/*`: migraciones disponibles.

Con estos pasos el backend queda listo para ser consumido por el frontend siguiendo únicamente las instrucciones de este README.
