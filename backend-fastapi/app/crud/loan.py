from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime
from app.models.loan import Loan
from app.models.book import Book
from app.schemas.loan import LoanCreate


async def get_loans(db: AsyncSession):
    result = await db.execute(select(Loan))
    return result.scalars().all()


async def get_active_loans(db: AsyncSession):
    result = await db.execute(select(Loan).where(Loan.is_returned == False))
    return result.scalars().all()


async def create_loan(db: AsyncSession, loan: LoanCreate):
    result = await db.execute(select(Book).where(Book.id == loan.book_id))
    db_book = result.scalar_one_or_none()
    if not db_book or not db_book.is_available:
        return None
    db_book.is_available = False
    db_loan = Loan(**loan.model_dump())
    db.add(db_loan)
    await db.commit()
    await db.refresh(db_loan)
    return db_loan


async def return_loan(db: AsyncSession, loan_id: int):
    # selectinload żeby eager-loadować book (lazy loading nie działa w async)
    result = await db.execute(
        select(Loan).where(Loan.id == loan_id).options(selectinload(Loan.book))
    )
    db_loan = result.scalar_one_or_none()
    if not db_loan or db_loan.is_returned:
        return None
    db_loan.is_returned = True
    db_loan.returned_at = datetime.now()
    db_loan.book.is_available = True
    await db.commit()
    await db.refresh(db_loan)
    return db_loan


async def delete_loan(db: AsyncSession, loan_id: int):
    result = await db.execute(select(Loan).where(Loan.id == loan_id))
    db_loan = result.scalar_one_or_none()
    if not db_loan:
        return False
    await db.delete(db_loan)
    await db.commit()
    return True