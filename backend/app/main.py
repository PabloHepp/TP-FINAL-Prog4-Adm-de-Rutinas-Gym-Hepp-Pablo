# Este archivo configura la aplicación FastAPI, incluyendo middleware CORS,
# inicialización de la base de datos y registro de rutas de la API.
# También define un endpoint de verificación de estado (health check).
# La configuración CORS permite solicitudes desde el frontend en desarrollo.
# La función on_startup inicializa la base de datos al iniciar la aplicación.
# Finalmente, se incluye el router de rutinas para gestionar las operaciones relacionadas con las rutinas de ejercicios.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, rutinas # Importa los routers

from app.db.session import init_db

app = FastAPI(title="Administrador de Rutinas - Gym Tormund")

# Configuración de CORS para permitir solicitudes desde el frontend
# Permite solicitudes desde localhost:5173 (donde típicamente corre el frontend de desarrollo)
# Esto es necesario para que el frontend pueda comunicarse con este backend sin problemas de CORS
# Se permiten todas las credenciales, métodos y encabezados
# Ajusta estos valores según las necesidades de seguridad de tu aplicación
# Por ejemplo, en producción podrías querer restringir los orígenes permitidos
# para mayor seguridad y evitar accesos no autorizados desde otros dominios
# asegúrate de revisar y actualizar esta configuración antes de desplegar en producción


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

    ],
    # allow_origin_regex=r"https?://localhost(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(auth.router)
app.include_router(rutinas.router) # Incluye el router de rutinas en la aplicación


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
