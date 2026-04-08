from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    loaned_at = Column(DateTime, server_default=func.now())
    due_date = Column(DateTime, nullable=True)
    returned_at = Column(DateTime, nullable=True)
    is_returned = Column(Boolean, default=False)

    book = relationship("Book")
    member = relationship("Member")