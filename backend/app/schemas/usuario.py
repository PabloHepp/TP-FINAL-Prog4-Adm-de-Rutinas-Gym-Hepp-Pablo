from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UsuarioBase(BaseModel):
    nombre: str = Field(..., max_length=120)
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=4, max_length=20)


class UsuarioRead(UsuarioBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4, max_length=20)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: int | None = None
    exp: int | None = None
