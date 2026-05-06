from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.member import MemberCreate, MemberUpdate, MemberRead
from app import crud

router = APIRouter(prefix="/api/members", tags=["members"])


@router.get("/", response_model=list[MemberRead])
async def get_members(db: AsyncSession = Depends(get_db)):
    return await crud.member.get_members(db)


@router.post("/", response_model=MemberRead, status_code=201)
async def create_member(member: MemberCreate, db: AsyncSession = Depends(get_db)):
    return await crud.member.create_member(db, member)


@router.get("/{member_id}", response_model=MemberRead)
async def get_member(member_id: int, db: AsyncSession = Depends(get_db)):
    db_member = await crud.member.get_member(db, member_id)
    if not db_member:
        raise HTTPException(status_code=404, detail="Członek nie znaleziony")
    return db_member


@router.put("/{member_id}", response_model=MemberRead)
async def update_member(member_id: int, member: MemberUpdate, db: AsyncSession = Depends(get_db)):
    db_member = await crud.member.update_member(db, member_id, member)
    if not db_member:
        raise HTTPException(status_code=404, detail="Członek nie znaleziony")
    return db_member


@router.delete("/{member_id}", response_model=MemberRead)
async def delete_member(member_id: int, db: AsyncSession = Depends(get_db)):
    db_member = await crud.member.delete_member(db, member_id)
    if not db_member:
        raise HTTPException(status_code=404, detail="Członek nie znaleziony")
    return db_member