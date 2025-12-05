# este archivo define los esquemas Pydantic para las operaciones de creación,
# lectura y actualización de las entidades Rutina y Ejercicio
# estos esquemas se utilizan para validar y serializar los datos
# facilitando la interacción entre la API y la base de datos
# los esquemas están organizados en clases base, de creación, de lectura y de actualización
# lo que permite una gestión clara y estructurada de los datos en diferentes contextos
# además, se incluye un esquema específico para las respuestas de búsqueda de rutinas
# que devuelve una lista de rutinas encontradas
# estos esquemas son esenciales para garantizar la integridad de los datos
# y mejorar la experiencia del desarrollador al trabajar con la API
# asegurando que los datos cumplan con las reglas definidas antes de ser procesados o almacenados

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models import DiaSemana


class EjercicioBase(BaseModel):
    nombre: str = Field(..., max_length=120)
    dia_semana: DiaSemana
    series: int = Field(..., gt=0, le=20)
    repeticiones: int = Field(..., gt=0, le=50)
    peso: Optional[float] = Field(default=None, ge=0)
    notas: Optional[str] = Field(default=None, max_length=500)
    orden: int = Field(default=1, ge=1)

# Esquemas para la entidad Ejercicio
# Incluyen creación, lectura y actualización

class EjercicioCreate(EjercicioBase):
    pass # No se añaden campos adicionales para la creación


class EjercicioRead(EjercicioBase):
    id: int # Identificador único del ejercicio
    rutina_id: int # Clave foránea a Rutina

    class Config: # Configuración para permitir la creación desde atributos de SQLAlchemy
        from_attributes = True # Permite crear instancias desde objetos ORM


class EjercicioUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, max_length=120)
    dia_semana: Optional[DiaSemana] = None
    series: Optional[int] = Field(default=None, gt=0, le=20)
    repeticiones: Optional[int] = Field(default=None, gt=0, le=50)
    peso: Optional[float] = Field(default=None, ge=0)
    notas: Optional[str] = Field(default=None, max_length=500)
    orden: Optional[int] = Field(default=None, ge=1)


class RutinaBase(BaseModel):
    nombre: str = Field(..., max_length=120)
    descripcion: Optional[str] = Field(default=None, max_length=500)


class RutinaCreate(RutinaBase):
    ejercicios: List[EjercicioCreate] = Field(default_factory=list)


class RutinaRead(RutinaBase):
    id: int
    fecha_creacion: datetime
    ejercicios: List[EjercicioRead] = Field(default_factory=list)

    class Config:
        from_attributes = True


class RutinaUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, max_length=120)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    ejercicios: Optional[List[EjercicioCreate]] = None


class RutinaSearchResponse(BaseModel):
    resultados: List[RutinaRead]