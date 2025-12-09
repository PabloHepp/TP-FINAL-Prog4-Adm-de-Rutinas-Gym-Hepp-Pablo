from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

from jose import jwt
from passlib.context import CryptContext
from passlib.handlers import bcrypt as passlib_bcrypt

from app.core.config import get_settings

try:  # pragma: no cover - solo garantiza compatibilidad cuando bcrypt carece de __about__
    import bcrypt as _bcrypt

    if not hasattr(_bcrypt, "__about__"):
        version = getattr(_bcrypt, "__version__", "0")
        setattr(_bcrypt, "__about__", SimpleNamespace(__version__=version))
except ModuleNotFoundError:  # pragma: no cover
    _bcrypt = None


_wrap_bug_patch_applied = getattr(passlib_bcrypt, "_wrap_bug_patch_applied", False)


def _safe_detect_wrap_bug(*_args, **_kwargs):  # pragma: no cover - función defensiva
    return False


if not _wrap_bug_patch_applied:
    setattr(passlib_bcrypt, "detect_wrap_bug", _safe_detect_wrap_bug)
    setattr(passlib_bcrypt, "_wrap_bug_patch_applied", True)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def _clamp_password(password: str) -> str:
    data = password.encode("utf-8")
    if len(data) <= 72:
        return password
    return data[:72].decode("utf-8", errors="ignore")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_clamp_password(plain_password), hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(_clamp_password(password))


def create_access_token(subject: int, expires_delta: timedelta | None = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
