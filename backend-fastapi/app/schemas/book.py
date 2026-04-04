from pydantic import BaseModel
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    genre: Optional[str] = None
    isbn: Optional[str] = None
    is_available: bool = True

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    isbn: Optional[str] = None
    is_available: Optional[bool] = None

class BookRead(BookBase):
    id: int

    class Config:
        from_attributes = True