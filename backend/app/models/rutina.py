from datetime import datetime
from enum import Enum
from typing import List

from sqlalchemy import Column, Enum as SqlEnum
from sqlmodel import Field, Relationship, SQLModel

class DiaSemana(str, Enum):
    LUNES = "lunes"
    MARTES = "martes"
    MIERCOLES = "miercoles"
    JUEVES = "jueves"
    VIERNES = "viernes"
    SABADO = "sabado"
    DOMINGO = "domingo"


class Rutina(SQLModel, table=True):
    
    __tablename__ = "rutinas"  # type: ignore[assignment]
    
    # Definición de las columnas de la tabla rutinas

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=120, unique=True, index=True)
    descripcion: str | None = Field(default=None, max_length=500)
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    ejercicios: List["Ejercicio"] = Relationship(
        back_populates="rutina",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "lazy": "joined"},
    )


class Ejercicio(SQLModel, table=True):
    
    __tablename__ = "ejercicios"  # type: ignore[assignment]
    
    # Definición de las columnas de la tabla ejercicios
    # Incluye una clave foránea que referencia a la tabla rutinas

    id: int | None = Field(default=None, primary_key=True)
    rutina_id: int = Field(foreign_key="rutinas.id", ondelete="CASCADE")
    nombre: str = Field(max_length=120)
    dia_semana: DiaSemana = Field(
        sa_column=Column(SqlEnum(DiaSemana, name="dia_semana_enum", create_constraint=True)),
    )
    series: int = Field(gt=0, le=20)
    repeticiones: int = Field(gt=0, le=50)
    peso: float | None = Field(default=None, ge=0)
    notas: str | None = Field(default=None, max_length=500)
    orden: int = Field(default=1, ge=1)

    rutina: "Rutina" = Relationship(back_populates="ejercicios")
