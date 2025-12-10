# Backend Dockerfile (FastAPI + Uvicorn)
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema que pudieran necesitar algunas librerías (opcional pero seguro para psycopg/sqlite)
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar primero el archivo de dependencias para aprovechar cache
COPY backend/requeriments.txt ./requeriments.txt
RUN pip install --no-cache-dir -r requeriments.txt

# Copiar el resto del backend dentro del contenedor
COPY backend/ ./

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
