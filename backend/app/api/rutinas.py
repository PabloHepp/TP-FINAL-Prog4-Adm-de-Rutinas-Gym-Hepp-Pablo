# este archivo define las rutas de la API para gestionar las rutinas de ejercicios
# incluye operaciones para listar, obtener, crear, actualizar y eliminar rutinas
# utiliza FastAPI junto con SQLModel para interactuar con la base de datos

from typing import Any, List, Sequence, Union, cast

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlmodel import Session, select

from app.db.session import get_session
from app.models import DiaSemana, Ejercicio, Rutina
from app.schemas.rutina import (
    EjercicioCreate,
    RutinaCreate,
    RutinaRead,
    RutinaUpdate,
)

def _rutina_ejercicios_attr() -> InstrumentedAttribute[Any]:
    return cast(InstrumentedAttribute[Any], Rutina.ejercicios)


def _rutina_nombre_attr() -> InstrumentedAttribute[Any]:
    return cast(InstrumentedAttribute[Any], Rutina.nombre)


def _rutina_fecha_attr() -> InstrumentedAttribute[Any]:
    return cast(InstrumentedAttribute[Any], Rutina.fecha_creacion)

router = APIRouter(prefix="/rutinas", tags=["rutinas"]) 
# Router para las operaciones de rutinas
# Todas las rutas estarán bajo el prefijo /rutinas
# Las rutas estarán etiquetadas con "rutinas" para documentación

## Todos los handlers dependen de get_session, el generador de sesiones SQLModel definido en app.db.session, así que FastAPI abre una sesión por request y la cierra al final.
## Para convertir objetos de base de datos a JSON, cada endpoint usa los esquemas de app.schemas.rutina (RutinaRead, RutinaCreate, etc.), lo que asegura que la respuesta tenga siempre la forma esperada y valida la entrada de forma automática.

## ENDPOINTS

@router.get("/", response_model=List[RutinaRead]) # Lista todas las rutinas con filtros opcionales
def list_rutinas(
    search: str | None = Query(default=None, description="Filtra por nombre de rutina"),
    dia_semana: DiaSemana | None = Query(
        default=None,
        description="Devuelve solo rutinas que contengan ejercicios en ese día",
    ),
    session: Session = Depends(get_session),
) -> Sequence[Rutina]:
    statement = (
        select(Rutina) # Selecciona todas las rutinas
        .options(selectinload(_rutina_ejercicios_attr())) # Carga los ejercicios relacionados
        .order_by(_rutina_fecha_attr().desc())
    )

    if search:
        criterio = f"%{search.strip()}%"
        statement = statement.where(_rutina_nombre_attr().ilike(criterio))

    if dia_semana:
        statement = statement.join(_rutina_ejercicios_attr()).where(Ejercicio.dia_semana == dia_semana).distinct()

    return session.exec(statement).all()


@router.get("/{rutina_id}", response_model=RutinaRead)
def get_rutina(rutina_id: int, session: Session = Depends(get_session)) -> Rutina:
    statement = (
        select(Rutina)
        .options(selectinload(_rutina_ejercicios_attr()))
        .where(Rutina.id == rutina_id)
    )
    rutina = session.exec(statement).first()
    if not rutina:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")
    return rutina


@router.post("/", response_model=RutinaRead, status_code=status.HTTP_201_CREATED)
def create_rutina(payload: RutinaCreate, session: Session = Depends(get_session)) -> Rutina:
    rutina = Rutina(nombre=payload.nombre, descripcion=payload.descripcion)
    rutina.ejercicios = _build_ejercicios(payload.ejercicios)

    session.add(rutina)
    try:
        session.commit()
    except IntegrityError as exc:  # pragma: no cover - captura conflictos de clave única
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una rutina con ese nombre",
        ) from exc

    session.refresh(rutina)
    return rutina


@router.put("/{rutina_id}", response_model=RutinaRead)
def update_rutina(
    rutina_id: int,
    payload: RutinaUpdate,
    session: Session = Depends(get_session),
) -> Rutina:
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    datos_actualizados = payload.model_dump(exclude_unset=True)
    ejercicios_payload = datos_actualizados.pop("ejercicios", None)

    for campo, valor in datos_actualizados.items():
        setattr(rutina, campo, valor)

    if ejercicios_payload is not None:
        rutina.ejercicios.clear()
        rutina.ejercicios.extend(_build_ejercicios(ejercicios_payload))

    session.add(rutina)
    try:
        session.commit()
    except IntegrityError as exc:  # pragma: no cover
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una rutina con ese nombre",
        ) from exc

    session.refresh(rutina)
    return rutina


@router.delete("/{rutina_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rutina(rutina_id: int, session: Session = Depends(get_session)) -> None:
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    session.delete(rutina)
    session.commit()


def _build_ejercicios(items: Sequence[Union[EjercicioCreate, dict[str, Any]]]) -> list[Ejercicio]:
    ejercicios: list[Ejercicio] = []
    for ejercicio in items:
        payload = (
            ejercicio.model_dump()
            if isinstance(ejercicio, EjercicioCreate)
            else cast(dict[str, Any], ejercicio)
        )
        ejercicios.append(Ejercicio(**payload))
    return ejercicios
