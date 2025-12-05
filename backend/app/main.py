from fastapi import FastAPI

from app.db.session import init_db

app = FastAPI(title="Administrador de Rutinas - Gym Tormund")


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
