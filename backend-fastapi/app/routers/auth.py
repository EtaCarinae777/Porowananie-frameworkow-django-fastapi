from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.models.member import Member
from app.utils import security

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Konfiguracja czasów wygasania (można przenieść do pliku config)
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # 1. Pobieranie użytkownika z bazy
    result = await db.execute(select(Member).where(Member.email == data.email))
    user = result.scalar_one_or_none()

    # 2. Weryfikacja hasła (Oddelegowana do osobnego wątku, by nie blokować pętli!)
    if user:
        is_password_valid = await run_in_threadpool(
            security.verify_password, data.password, user.password
        )
    else:
        is_password_valid = False

    if not is_password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Niepoprawny email lub hasło",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generowanie tokenów przy użyciu funkcji z security.py
    access_token = security.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    refresh_token = security.create_refresh_token(
        data={"sub": user.email},
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        },
    }


@router.post("/refresh")
async def refresh_token(data: RefreshRequest):
    # Dekodowanie tokena (zabezpieczone try-except wewnątrz decode_token)
    payload = security.decode_token(data.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy lub przedawniony token odświeżania",
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Błędny ładunek tokena",
        )

    # Generowanie nowego access tokena
    new_access_token = security.create_access_token(
        data={"sub": email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.get("/me")
async def get_me(
        db: AsyncSession = Depends(get_db),
        current_user_email: str = Depends(security.get_current_user),
):
    result = await db.execute(
        select(Member).where(Member.email == current_user_email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie istnieje"
        )

    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
    }