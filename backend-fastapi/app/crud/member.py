from sqlalchemy.orm import Session
from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdate

def get_members(db: Session):
    return db.query(Member).all()

def get_member(db: Session, member_id: int):
    return db.query(Member).filter(Member.id == member_id).first()

def create_member(db: Session, member: MemberCreate):
    db_member = Member(**member.model_dump())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def update_member(db: Session, member_id: int, member: MemberUpdate):
    db_member = get_member(db, member_id)
    if not db_member:
        return None
    for key, value in member.model_dump(exclude_unset=True).items():
        setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

def delete_member(db: Session, member_id: int):
    db_member = get_member(db, member_id)
    if not db_member:
        return None
    db.delete(db_member)
    db.commit()
    return db_member