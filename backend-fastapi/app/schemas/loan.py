from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.book import BookRead


class LoanCreate(BaseModel):
    book_id: int = Field(alias="bookId")
    member_id: int = Field(alias="memberId")
    due_date: Optional[datetime] = Field(default=None, alias="dueDate")

    class Config:
        populate_by_name = True


class LoanRead(BaseModel):
    id: int
    book_id: int = Field(alias="bookId")
    member_id: int = Field(alias="memberId")
    loaned_at: Optional[datetime] = Field(alias="loanedAt")
    due_date: Optional[datetime] = Field(alias="dueDate")
    returned_at: Optional[datetime] = Field(alias="returnedAt")
    is_returned: bool = Field(alias="isReturned")

    book: BookRead

    class Config:
        from_attributes = True
        populate_by_name = True