from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings # Importa la función para obtener la configuración

settings = get_settings()
engine = create_engine(settings.sqlmodel_database_uri, echo=settings.app_debug, future=True)


def init_db() -> None:
    SQLModel.metadata.create_all(bind=engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
