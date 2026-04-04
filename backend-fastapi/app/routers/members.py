from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.member import MemberCreate, MemberUpdate, MemberRead
from app import crud

router = APIRouter(prefix="/api/members", tags=["members"])

@router.get("/", response_model=list[MemberRead])
def get_members(db: Session = Depends(get_db)):
    return crud.member.get_members(db)

@router.post("/", response_model=MemberRead, status_code=201)
def create_member(member: MemberCreate, db: Session = Depends(get_db)):
    return crud.member.create_member(db, member)

@router.get("/{member_id}", response_model=MemberRead)
def get_member(member_id: int, db: Session = Depends(get_db)):
    db_member = crud.member.get_member(db, member_id)
    if not db_member:
        raise HTTPException(status_code=404, detail="Członek nie znaleziony")
    return db_member

@router.put("/{member_id}", response_model=MemberRead)
def update_member(member_id: int, member: MemberUpdate, db: Session = Depends(get_db)):
    db_member = crud.member.update_member(db, member_id, member)
    if not db_member:
        raise HTTPException(status_code=404, detail="Członek nie znaleziony")
    return db_member

@router.delete("/{member_id}", response_model=MemberRead)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    db_member = crud.member.delete_member(db, member_id)
    if not db_member:
        raise HTTPException(status_code=404, detail="Członek nie znaleziony")
    return db_member