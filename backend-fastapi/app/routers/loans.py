from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.loan import LoanCreate, LoanRead
from app.crud import loan as crud_loan

router = APIRouter(prefix="/api/loans", tags=["loans"])

@router.get("/", response_model=list[LoanRead])
def get_loans(db: Session = Depends(get_db)):
    return crud_loan.get_loans(db)

@router.get("/active", response_model=list[LoanRead])
def get_active_loans(db: Session = Depends(get_db)):
    return crud_loan.get_active_loans(db)

@router.post("/", response_model=LoanRead, status_code=201)
def create_loan(loan: LoanCreate, db: Session = Depends(get_db)):
    db_loan = crud_loan.create_loan(db, loan)
    if not db_loan:
        raise HTTPException(status_code=400, detail="Książka niedostępna lub nie istnieje")
    return db_loan

@router.post("/{loan_id}/return", response_model=LoanRead)
def return_loan(loan_id: int, db: Session = Depends(get_db)):
    db_loan = crud_loan.return_loan(db, loan_id)
    if not db_loan:
        raise HTTPException(status_code=400, detail="Wypożyczenie nie istnieje lub już zwrócone")
    return db_loan

@router.delete("/{loan_id}")
def delete_existing_loan(loan_id: int, db: Session = Depends(get_db)):
    success = crud_loan.delete_loan(db, loan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Wypożyczenie nie istnieje")
    return {"message": "Wypożyczenie zostało usunięte"}