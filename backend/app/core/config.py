from functools import lru_cache
from typing import Annotated

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = Field(default="development")
    app_debug: bool = Field(default=True)
    app_port: int = Field(default=8000, ge=1, le=65535)

    db_host: str = Field(default="localhost")
    db_port: int = Field(default=5432)
    db_name: str = Field(default="gym_Tormund")
    db_user: str = Field(default="postgres")
    db_password: str = Field(default="123456")

    database_url: Annotated[str | None, Field(alias="DATABASE_URL")] = None

    secret_key: str = Field(default="insecure-secret", min_length=16)
    access_token_expire_minutes: int = Field(default=60, ge=1)
    jwt_algorithm: str = Field(default="HS256")

    @property
    def sqlmodel_database_uri(self) -> str:
        if self.database_url:
            return str(self.database_url)
        return (
            f"postgresql+psycopg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
