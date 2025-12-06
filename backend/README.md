# Backend - Administrador de Rutinas - Gym Tormund

API REST construida con FastAPI, SQLModel y PostgreSQL para gestionar rutinas de entrenamiento en un gym.

## Requisitos previos

- Python 3.10+
- PostgreSQL 14+
- `pip` actualizado

## Configuración

1. Crear entorno virtual y activarlo (en powershell):

   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate
   
2. Instalar dependencias (en powershell):

   pip install --upgrade pip
   pip install -r requirements.txt
  
3. Configurar variables de entorno copiando `.env.example` a `.env` y actualizando credenciales.

4. Crear base de datos en PostgreSQL (`gym_Tormund` por defecto) antes de iniciar la app.

## Migraciones de base de datos

El proyecto usa Alembic. Después de instalar dependencias:

```
alembic upgrade head
```

Esto crea las tablas `rutinas` y `ejercicios` en la base indicada en `.env`.

## Ejecución (en powershell)

```
uvicorn app.main:app --reload --port 8000
```

- Health-check: `GET http://localhost:8000/health`
- Documentación interactiva: `http://localhost:8000/docs`

## Uso de la API de rutinas

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/rutinas/` | Lista rutinas. Parámetros opcionales: `search` (nombre parcial) y `dia_semana` (enum `lunes`..`domingo`). |
| `GET` | `/rutinas/{id}` | Devuelve una rutina con sus ejercicios. |
| `POST` | `/rutinas/` | Crea una rutina con ejercicios embebidos. |
| `PUT` | `/rutinas/{id}` | Actualiza nombre/descripcion y reemplaza la lista de ejercicios enviada. |
| `DELETE` | `/rutinas/{id}` | Elimina la rutina y sus ejercicios asociados. |

### Ejemplo de creación

```json
{
   "nombre": "Inicial",
   "descripcion": "Rutina para retomar actividad física",
   "ejercicios": [
      {
         "nombre": "Press mancuerna",
         "dia_semana": "lunes",
         "series": 3,
         "repeticiones": 10,
         "peso": 5,
         "notas": "Hombros",
         "orden": 1
      }
   ]
}
```

Posibles respuestas:

- `201 Created` con el objeto `RutinaRead` completo.
- `400 Bad Request` si el nombre ya existe o los datos violan validaciones.

### Ejemplo de actualización parcial

```json
{
   "descripcion": "Rutina revisada",
   "ejercicios": [
      {
         "nombre": "Remo con barra",
         "dia_semana": "martes",
         "series": 4,
         "repeticiones": 8,
         "peso": 35,
         "orden": 1
      }
   ]
}
```

Enviar una lista vacía en `ejercicios` borra los ejercicios existentes.

## Estructura del backend

- `app/core/config.py`: configuración usando `pydantic-settings`.
- `app/db/session.py`: engine y sesiones de SQLModel.
- `app/main.py`: instancia FastAPI, health-check y registro de routers.
- `app/api/rutinas.py`: endpoints CRUD de rutinas/ejercicios.
- `app/models/*`: definiciones SQLModel y relaciones.
- `app/schemas/*`: esquemas Pydantic para request/response.
