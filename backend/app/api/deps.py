from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlmodel import Session

from app.core.config import get_settings
from app.db.session import get_session
from app.models import Usuario
from app.schemas.usuario import TokenPayload

security_scheme = HTTPBearer(auto_error=False)
settings = get_settings()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    session: Session = Depends(get_session),
) -> Usuario:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No autenticado")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        token_data = TokenPayload(**payload)
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido") from None

    if token_data.sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

    usuario = session.get(Usuario, token_data.sub)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

    return usuario
