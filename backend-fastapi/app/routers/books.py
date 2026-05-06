from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.book import BookCreate, BookUpdate, BookRead
from app import crud

router = APIRouter(prefix="/api/books", tags=["books"])


@router.get("/", response_model=list[BookRead])
async def get_books(db: AsyncSession = Depends(get_db)):
    return await crud.book.get_books(db)


@router.post("/", response_model=BookRead, status_code=201)
async def create_book(book: BookCreate, db: AsyncSession = Depends(get_db)):
    return await crud.book.create_book(db, book)


@router.get("/{book_id}", response_model=BookRead)
async def get_book(book_id: int, db: AsyncSession = Depends(get_db)):
    db_book = await crud.book.get_book(db, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Książka nie znaleziona")
    return db_book


@router.put("/{book_id}", response_model=BookRead)
async def update_book(book_id: int, book: BookUpdate, db: AsyncSession = Depends(get_db)):
    db_book = await crud.book.update_book(db, book_id, book)
    if not db_book:
        raise HTTPException(status_code=404, detail="Książka nie znaleziona")
    return db_book


@router.delete("/{book_id}", response_model=BookRead)
async def delete_book(book_id: int, db: AsyncSession = Depends(get_db)):
    db_book = await crud.book.delete_book(db, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Książka nie znaleziona")
    return db_book