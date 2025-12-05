from fastapi import FastAPI

from app.api import rutinas # Importa el router de rutinas luego de configurar las rutas

from app.db.session import init_db

app = FastAPI(title="Administrador de Rutinas - Gym Tormund")


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(rutinas.router) # Incluye el router de rutinas en la aplicación


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
