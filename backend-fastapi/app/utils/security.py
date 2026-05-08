import asyncio
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def hash_password_async(password: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, pwd_context.hash, password)


async def verify_password_async(plain_password: str, hashed_password: str) -> bool:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, pwd_context.verify, plain_password, hashed_password)




SECRET_KEY = "super-tajny-klucz-biblioteki"  # ⚠️ w produkcji: ENV VARIABLE
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


def get_email_from_token(token: str) -> Optional[str]:
    payload = decode_token(token)
    if not payload:
        return None
    return payload.get("sub")



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    return email