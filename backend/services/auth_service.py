import jwt
import bcrypt
import uuid
from datetime import datetime, timedelta, timezone
from config import JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRE_MINUTES, JWT_REFRESH_TOKEN_EXPIRE_DAYS

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_access_token(member_id: str, org_id: str, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": member_id,
        "org_id": org_id,
        "role": role,
        "exp": now + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": now,
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)


def create_refresh_token(member_id: str, org_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": member_id,
        "org_id": org_id,
        "exp": now + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAYS),
        "iat": now,
        "jti": str(uuid.uuid4()),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def create_delegated_session_token() -> str:
    return f"sess_{uuid.uuid4().hex}"