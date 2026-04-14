from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.book import BookRead


class LoanCreate(BaseModel):
    book_id: int
    member_id: int
    due_date: Optional[datetime] = None


class LoanRead(BaseModel):
    id: int
    book_id: int
    member_id: int
    loaned_at: Optional[datetime]
    due_date: Optional[datetime]
    returned_at: Optional[datetime]
    is_returned: bool

    book: BookRead

    class Config:
        from_attributes = True