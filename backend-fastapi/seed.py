import asyncio
import sys
import os
from datetime import datetime, timedelta

# Uruchamiaj z katalogu gdzie jest folder app/
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.ext.asyncio import AsyncSession
from app.database import engine, Base, AsyncSessionLocal
from app.models.book import Book
from app.models.member import Member
from app.models.loan import Loan
from app.utils.security import hash_password

# -------------------------
# KSIĄŻKI
# -------------------------
books_data = [
    {"title": "Wiedźmin: Ostatnie życzenie", "author": "Andrzej Sapkowski", "genre": "Fantasy", "isbn": "978-83-7278-001-1"},
    {"title": "Wiedźmin: Miecz przeznaczenia", "author": "Andrzej Sapkowski", "genre": "Fantasy", "isbn": "978-83-7278-001-2"},
    {"title": "Wiedźmin: Krew elfów", "author": "Andrzej Sapkowski", "genre": "Fantasy", "isbn": "978-83-7278-001-3"},
    {"title": "Pan Tadeusz", "author": "Adam Mickiewicz", "genre": "Epopeja", "isbn": "978-83-7278-001-4"},
    {"title": "Dziady", "author": "Adam Mickiewicz", "genre": "Dramat", "isbn": "978-83-7278-001-5"},
    {"title": "Solaris", "author": "Stanisław Lem", "genre": "Science Fiction", "isbn": "978-83-7278-001-6"},
    {"title": "Cyberiada", "author": "Stanisław Lem", "genre": "Science Fiction", "isbn": "978-83-7278-001-7"},
    {"title": "Niezwyciężony", "author": "Stanisław Lem", "genre": "Science Fiction", "isbn": "978-83-7278-001-8"},
    {"title": "Lalka", "author": "Bolesław Prus", "genre": "Powieść", "isbn": "978-83-7278-001-9"},
    {"title": "Faraon", "author": "Bolesław Prus", "genre": "Powieść historyczna", "isbn": "978-83-7278-001-10"},
    {"title": "Zbrodnia i kara", "author": "Fiodor Dostojewski", "genre": "Dramat", "isbn": "978-83-7278-001-11"},
    {"title": "Idiota", "author": "Fiodor Dostojewski", "genre": "Powieść", "isbn": "978-83-7278-001-12"},
    {"title": "Bracia Karamazow", "author": "Fiodor Dostojewski", "genre": "Powieść", "isbn": "978-83-7278-001-13"},
    {"title": "Mistrz i Małgorzata", "author": "Michaił Bułhakow", "genre": "Fantasy", "isbn": "978-83-7278-001-14"},
    {"title": "Duma i uprzedzenie", "author": "Jane Austen", "genre": "Romans", "isbn": "978-83-7278-001-15"},
    {"title": "Rozważna i romantyczna", "author": "Jane Austen", "genre": "Romans", "isbn": "978-83-7278-001-16"},
    {"title": "Harry Potter i Kamień Filozoficzny", "author": "J.K. Rowling", "genre": "Fantasy", "isbn": "978-83-7278-001-17"},
    {"title": "Harry Potter i Komnata Tajemnic", "author": "J.K. Rowling", "genre": "Fantasy", "isbn": "978-83-7278-001-18"},
    {"title": "Harry Potter i Więzień Azkabanu", "author": "J.K. Rowling", "genre": "Fantasy", "isbn": "978-83-7278-001-19"},
    {"title": "Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "isbn": "978-83-7278-001-20"},
    {"title": "Władca Pierścieni: Drużyna Pierścienia", "author": "J.R.R. Tolkien", "genre": "Fantasy", "isbn": "978-83-7278-001-21"},
    {"title": "Władca Pierścieni: Dwie Wieże", "author": "J.R.R. Tolkien", "genre": "Fantasy", "isbn": "978-83-7278-001-22"},
    {"title": "1984", "author": "George Orwell", "genre": "Dystopia", "isbn": "978-83-7278-001-23"},
    {"title": "Folwark Zwierzęcy", "author": "George Orwell", "genre": "Satyra", "isbn": "978-83-7278-001-24"},
    {"title": "Nowy wspaniały świat", "author": "Aldous Huxley", "genre": "Dystopia", "isbn": "978-83-7278-001-25"},
    {"title": "Mały Książę", "author": "Antoine de Saint-Exupéry", "genre": "Bajka", "isbn": "978-83-7278-001-26"},
    {"title": "Sto lat samotności", "author": "Gabriel García Márquez", "genre": "Realizm magiczny", "isbn": "978-83-7278-001-27"},
    {"title": "Miłość w czasie zarazy", "author": "Gabriel García Márquez", "genre": "Romans", "isbn": "978-83-7278-001-28"},
    {"title": "Proces", "author": "Franz Kafka", "genre": "Absurd", "isbn": "978-83-7278-001-29"},
    {"title": "Zamek", "author": "Franz Kafka", "genre": "Absurd", "isbn": "978-83-7278-001-30"},
    {"title": "Wielki Gatsby", "author": "F. Scott Fitzgerald", "genre": "Powieść", "isbn": "978-83-7278-001-31"},
    {"title": "Zabić drozda", "author": "Harper Lee", "genre": "Powieść", "isbn": "978-83-7278-001-32"},
    {"title": "Władca Much", "author": "William Golding", "genre": "Dystopia", "isbn": "978-83-7278-001-33"},
    {"title": "Stary człowiek i morze", "author": "Ernest Hemingway", "genre": "Powieść", "isbn": "978-83-7278-001-34"},
    {"title": "Dune", "author": "Frank Herbert", "genre": "Science Fiction", "isbn": "978-83-7278-001-35"},
]

# -------------------------
# UŻYTKOWNICY
# -------------------------
members_data = [
    {"first_name": "Anna", "last_name": "Kowalska", "email": "anna.kowalska@example.com", "phone": "601100200"},
    {"first_name": "Piotr", "last_name": "Nowak", "email": "piotr.nowak@example.com", "phone": "602200300"},
    {"first_name": "Maria", "last_name": "Wiśniewska", "email": "maria.wisniewska@example.com", "phone": "603300400"},
    {"first_name": "Tomasz", "last_name": "Wójcik", "email": "tomasz.wojcik@example.com", "phone": "604400500"},
    {"first_name": "Katarzyna", "last_name": "Kamińska", "email": "katarzyna.kaminska@example.com", "phone": "605500600"},
    {"first_name": "Marcin", "last_name": "Lewandowski", "email": "marcin.lewandowski@example.com", "phone": "606600700"},
    {"first_name": "Agnieszka", "last_name": "Zielińska", "email": "agnieszka.zielinska@example.com", "phone": "607700800"},
    {"first_name": "Krzysztof", "last_name": "Szymański", "email": "krzysztof.szymanski@example.com", "phone": "608800900"},
]

# -------------------------
# WYPOŻYCZENIA (indeksy books/members jak w Django seedzie)
# -------------------------
loans_data = [
    {"member_idx": 0, "book_idx": 0,  "days": -5,  "returned": False},
    {"member_idx": 0, "book_idx": 5,  "days": -15, "returned": True},
    {"member_idx": 1, "book_idx": 1,  "days": -3,  "returned": False},
    {"member_idx": 1, "book_idx": 10, "days": -20, "returned": True},
    {"member_idx": 2, "book_idx": 2,  "days": -7,  "returned": False},
    {"member_idx": 3, "book_idx": 16, "days": -2,  "returned": False},
    {"member_idx": 3, "book_idx": 22, "days": -30, "returned": True},
    {"member_idx": 4, "book_idx": 19, "days": -10, "returned": False},
    {"member_idx": 5, "book_idx": 23, "days": -1,  "returned": False},
    {"member_idx": 6, "book_idx": 34, "days": -8,  "returned": False},
]


async def seed():
    # Tworzymy tabele jeśli nie istnieją
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:

        # --- KSIĄŻKI ---
        print("=== Dodawanie książek ===")
        books = []
        for b in books_data:
            existing = (await db.execute(
                __import__("sqlalchemy").future.select(Book).where(Book.isbn == b["isbn"])
            )).scalars().first()
            if existing:
                books.append(existing)
                print(f"Już istnieje: {b['title']}")
            else:
                book = Book(**b, is_available=True)
                db.add(book)
                await db.flush()
                books.append(book)
                print(f"Dodano: {b['title']}")

        # --- UŻYTKOWNICY ---
        print("\n=== Dodawanie użytkowników ===")
        members = []
        for m in members_data:
            existing = (await db.execute(
                __import__("sqlalchemy").future.select(Member).where(Member.email == m["email"])
            )).scalars().first()
            if existing:
                members.append(existing)
                print(f"Już istnieje: {m['first_name']} {m['last_name']}")
            else:
                member = Member(
                    **m,
                    password=hash_password("User123!")
                )
                db.add(member)
                await db.flush()
                members.append(member)
                print(f"Dodano: {m['first_name']} {m['last_name']}")

        # --- WYPOŻYCZENIA ---
        print("\n=== Dodawanie wypożyczeń ===")
        from sqlalchemy.future import select
        for l in loans_data:
            member = members[l["member_idx"]]
            book = books[l["book_idx"]]

            existing = (await db.execute(
                select(Loan).where(Loan.member_id == member.id, Loan.book_id == book.id)
            )).scalars().first()

            if existing:
                print(f"Już istnieje: {member.first_name} → {book.title}")
                continue

            loan_date = datetime.now() + timedelta(days=l["days"])
            due_date = loan_date + timedelta(days=14)
            returned_at = due_date if l["returned"] else None

            loan = Loan(
                member_id=member.id,
                book_id=book.id,
                due_date=due_date,
                returned_at=returned_at,
                is_returned=l["returned"],
            )
            db.add(loan)

            book.is_available = l["returned"]
            print(f"Dodano wypożyczenie: {member.first_name} → {book.title}")

        await db.commit()
        print("\n✓ Gotowe!")


if __name__ == "__main__":
    asyncio.run(seed())