from sqlalchemy.orm import Session
from datetime import datetime
from app.models.loan import Loan
from app.models.book import Book
from app.schemas.loan import LoanCreate

def get_loans(db: Session):
    return db.query(Loan).all()

def get_active_loans(db: Session):
    return db.query(Loan).filter(Loan.is_returned == False).all()

def create_loan(db: Session, loan: LoanCreate):
    db_book = db.query(Book).filter(Book.id == loan.book_id).first()
    if not db_book or not db_book.is_available:
        return None
    db_book.is_available = False
    db_loan = Loan(**loan.model_dump())
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def return_loan(db: Session, loan_id: int):
    db_loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not db_loan or db_loan.is_returned:
        return None
    db_loan.is_returned = True
    db_loan.returned_at = datetime.now()
    db_loan.book.is_available = True
    db.commit()
    db.refresh(db_loan)
    return db_loan


def delete_loan(db: Session, loan_id: int):
    db_loan = db.query(Loan).filter(Loan.id == loan_id).first()

    if db_loan:
        db.delete(db_loan)
        db.commit()
        return True
    return False