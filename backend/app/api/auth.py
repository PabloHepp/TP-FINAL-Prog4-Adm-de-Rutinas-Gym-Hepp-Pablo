import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.deps import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import get_session
from app.models import Usuario
from app.schemas.usuario import Token, UsuarioCreate, UsuarioLogin, UsuarioRead

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def register_usuario(payload: UsuarioCreate, session: Session = Depends(get_session)) -> Usuario:
    logger.info("Registrando nuevo usuario: %s", payload.email)
    existing = session.exec(select(Usuario).where(Usuario.email == payload.email)).first()
    if existing:
        logger.warning("Intento de registro con email existente: %s", payload.email)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya está registrado")

    usuario = Usuario(nombre=payload.nombre, email=payload.email, password_hash=get_password_hash(payload.password))
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    logger.info("Usuario registrado correctamente con id %s", usuario.id)
    return usuario


@router.post("/login", response_model=Token)
def login_usuario(payload: UsuarioLogin, session: Session = Depends(get_session)) -> Token:
    logger.info("Intento de login para %s", payload.email)
    usuario = session.exec(select(Usuario).where(Usuario.email == payload.email)).first()
    if not usuario or not verify_password(payload.password, usuario.password_hash):
        logger.warning("Credenciales invalidas para %s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    token = create_access_token(usuario.id)
    logger.info("Login exitoso para usuario id %s", usuario.id)
    return Token(access_token=token)


@router.get("/me", response_model=UsuarioRead)
def me(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    return current_user
