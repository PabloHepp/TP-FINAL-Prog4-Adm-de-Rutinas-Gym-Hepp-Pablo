from typing import List, Sequence

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.db.session import get_session
from app.models import DiaSemana, Ejercicio, Rutina
from app.schemas.rutina import (
    EjercicioCreate,
    RutinaCreate,
    RutinaRead,
    RutinaUpdate,
)

router = APIRouter(prefix="/rutinas", tags=["rutinas"])


@router.get("/", response_model=List[RutinaRead])
def list_rutinas(
    search: str | None = Query(default=None, description="Filtra por nombre de rutina"),
    dia_semana: DiaSemana | None = Query(
        default=None,
        description="Devuelve solo rutinas que contengan ejercicios en ese día",
    ),
    session: Session = Depends(get_session),
) -> Sequence[Rutina]:
    statement = (
        select(Rutina)
        .options(selectinload(Rutina.ejercicios))
        .order_by(Rutina.fecha_creacion.desc())
    )

    if search:
        criterio = f"%{search.strip()}%"
        statement = statement.where(Rutina.nombre.ilike(criterio))

    if dia_semana:
        statement = statement.join(Rutina.ejercicios).where(Ejercicio.dia_semana == dia_semana).distinct()

    return session.exec(statement).all()


@router.get("/{rutina_id}", response_model=RutinaRead)
def get_rutina(rutina_id: int, session: Session = Depends(get_session)) -> Rutina:
    statement = (
        select(Rutina)
        .options(selectinload(Rutina.ejercicios))
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


def _build_ejercicios(items: List[EjercicioCreate]) -> list[Ejercicio]:
    return [Ejercicio(**ejercicio.model_dump()) for ejercicio in items]
