from datetime import datetime

from sqlmodel import Field, SQLModel


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"  # type: ignore[assignment]

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=120)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
