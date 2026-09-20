"""Authentication utilities for JWT and password management."""

import time
import jwt
import os
import bcrypt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.environ.get("SECRET_KEY", os.environ.get("secret", "secret_key_change_me_in_prod"))
JWT_ALGORITHM = os.environ.get("ALGORITHM", os.environ.get("algorithm", "HS256"))

def signJWT(user_role: str, id: str, expiry_duration: int = 3600) -> str:
    payload = {
        "user_role": user_role,
        "id": id,
        "expires": time.time() + expiry_duration,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decodeJWT(token: str) -> dict | None:
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded if decoded.get("expires", 0) > time.time() else None
    except Exception:
        return None

def encrypt_password(password: str) -> str:
    """Hash a plain-text password with bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        return False