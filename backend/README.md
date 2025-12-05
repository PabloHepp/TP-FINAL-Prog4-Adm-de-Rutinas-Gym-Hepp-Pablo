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

## Ejecución (en powershell): 

uvicorn app.main:app --reload --port 8000

Swagger UI disponible en `http://localhost:8000/docs`.

## Estructura del backend

- `app/core/config.py`: configuración usando `pydantic-settings`.
- `app/db/session.py`: engine y sesiones de SQLModel.
- `app/main.py`: instancia FastAPI y eventos.
