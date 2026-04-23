from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.database import get_db
from app.models.member import Member
from app.utils import security

router = APIRouter(prefix="/api/auth", tags=["auth"])


# -------------------------
# MODELE REQUEST
# -------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


# -------------------------
# HELPERS (token payload)
# -------------------------

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_tokens(user_email: str):
    access_token = security.create_access_token(
        data={"sub": user_email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    refresh_token = security.create_access_token(
        data={"sub": user_email, "type": "refresh"},
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return access_token, refresh_token


# -------------------------
# LOGIN
# -------------------------

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Member).filter(Member.email == data.email).first()

    if not user or not security.verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Niepoprawny email lub hasło"
        )

    access_token, refresh_token = create_tokens(user.email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
             "email": user.email
}
    }


# -------------------------
# REFRESH TOKEN
# -------------------------

@router.post("/refresh")
def refresh_token(data: RefreshRequest):
    try:
        payload = security.decode_token(data.refresh_token)

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        new_access_token = security.create_access_token(
            data={"sub": email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


# -------------------------
# OPTIONAL: ME endpoint
# -------------------------

@router.get("/me")
def get_me(db: Session = Depends(get_db), current_user_email: str = Depends(security.get_current_user)):
    user = db.query(Member).filter(Member.email == current_user_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    }