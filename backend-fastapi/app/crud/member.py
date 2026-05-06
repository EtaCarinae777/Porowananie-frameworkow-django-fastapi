from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdate
from app.utils.security import hash_password


async def get_members(db: AsyncSession):
    result = await db.execute(select(Member))
    return result.scalars().all()


async def get_member(db: AsyncSession, member_id: int):
    result = await db.execute(select(Member).where(Member.id == member_id))
    return result.scalar_one_or_none()


async def create_member(db: AsyncSession, member: MemberCreate):
    hashed = hash_password(member.password)
    db_member = Member(
        first_name=member.first_name,
        last_name=member.last_name,
        email=member.email,
        phone=member.phone,
        password=hashed,
    )
    db.add(db_member)
    await db.commit()
    await db.refresh(db_member)
    return db_member


async def update_member(db: AsyncSession, member_id: int, member: MemberUpdate):
    db_member = await get_member(db, member_id)
    if not db_member:
        return None
    for key, value in member.model_dump(exclude_unset=True).items():
        setattr(db_member, key, value)
    await db.commit()
    await db.refresh(db_member)
    return db_member


async def delete_member(db: AsyncSession, member_id: int):
    db_member = await get_member(db, member_id)
    if not db_member:
        return None
    await db.delete(db_member)
    await db.commit()
    return db_member