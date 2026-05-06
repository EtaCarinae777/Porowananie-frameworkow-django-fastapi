import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.book import Book
from app.models.member import Member
from app.models.loan import Loan
from app.utils.security import hash_password
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# -------------------------
# KSIĄŻKI
# -------------------------
books_data = [
    {"title": "Quo Vadis", "author": "Henryk Sienkiewicz", "genre": "Powieść historyczna", "isbn": "978-83-7278-002-1"},
    {"title": "Potop", "author": "Henryk Sienkiewicz", "genre": "Powieść historyczna", "isbn": "978-83-7278-002-2"},
    {"title": "Ogniem i mieczem", "author": "Henryk Sienkiewicz", "genre": "Powieść historyczna", "isbn": "978-83-7278-002-3"},
    {"title": "Chłopi", "author": "Władysław Reymont", "genre": "Powieść", "isbn": "978-83-7278-002-4"},
    {"title": "Wesele", "author": "Stanisław Wyspiański", "genre": "Dramat", "isbn": "978-83-7278-002-5"},
    {"title": "Ferdydurke", "author": "Witold Gombrowicz", "genre": "Powieść", "isbn": "978-83-7278-002-6"},
    {"title": "Sklepy cynamonowe", "author": "Bruno Schulz", "genre": "Opowiadania", "isbn": "978-83-7278-002-7"},
    {"title": "Granica", "author": "Zofia Nałkowska", "genre": "Powieść", "isbn": "978-83-7278-002-8"},
    {"title": "Przedwiośnie", "author": "Stefan Żeromski", "genre": "Powieść", "isbn": "978-83-7278-002-9"},
    {"title": "Ludzie bezdomni", "author": "Stefan Żeromski", "genre": "Powieść", "isbn": "978-83-7278-002-10"},
    {"title": "Dżuma", "author": "Albert Camus", "genre": "Powieść", "isbn": "978-83-7278-002-11"},
    {"title": "Obcy", "author": "Albert Camus", "genre": "Powieść", "isbn": "978-83-7278-002-12"},
    {"title": "Egzystencjalizm jest humanizmem", "author": "Jean-Paul Sartre", "genre": "Filozofia", "isbn": "978-83-7278-002-13"},
    {"title": "Czarodziejska góra", "author": "Thomas Mann", "genre": "Powieść", "isbn": "978-83-7278-002-14"},
    {"title": "Ulisses", "author": "James Joyce", "genre": "Powieść", "isbn": "978-83-7278-002-15"},
    {"title": "Pani Bovary", "author": "Gustave Flaubert", "genre": "Powieść", "isbn": "978-83-7278-002-16"},
    {"title": "Czerwone i czarne", "author": "Stendhal", "genre": "Powieść", "isbn": "978-83-7278-002-17"},
    {"title": "Nędznicy", "author": "Victor Hugo", "genre": "Powieść", "isbn": "978-83-7278-002-18"},
    {"title": "Trzy muszkieterowie", "author": "Alexandre Dumas", "genre": "Przygodowa", "isbn": "978-83-7278-002-19"},
    {"title": "Hrabia Monte Christo", "author": "Alexandre Dumas", "genre": "Przygodowa", "isbn": "978-83-7278-002-20"},
    {"title": "Don Kichot", "author": "Miguel de Cervantes", "genre": "Powieść", "isbn": "978-83-7278-002-21"},
    {"title": "Boska Komedia", "author": "Dante Alighieri", "genre": "Poemat", "isbn": "978-83-7278-002-22"},
    {"title": "Iliada", "author": "Homer", "genre": "Epos", "isbn": "978-83-7278-002-23"},
    {"title": "Odyseja", "author": "Homer", "genre": "Epos", "isbn": "978-83-7278-002-24"},
    {"title": "Makbet", "author": "William Shakespeare", "genre": "Dramat", "isbn": "978-83-7278-002-25"},
    {"title": "Hamlet", "author": "William Shakespeare", "genre": "Dramat", "isbn": "978-83-7278-002-26"},
    {"title": "Romeo i Julia", "author": "William Shakespeare", "genre": "Dramat", "isbn": "978-83-7278-002-27"},
    {"title": "Faust", "author": "Johann Wolfgang von Goethe", "genre": "Dramat", "isbn": "978-83-7278-002-28"},
    {"title": "Zbrodnia i kara", "author": "Fiodor Dostojewski", "genre": "Powieść", "isbn": "978-83-7278-002-29"},
    {"title": "Anna Karenina", "author": "Lew Tołstoj", "genre": "Powieść", "isbn": "978-83-7278-002-30"},
    {"title": "Wojna i pokój", "author": "Lew Tołstoj", "genre": "Powieść", "isbn": "978-83-7278-002-31"},
    {"title": "Martwe dusze", "author": "Mikołaj Gogol", "genre": "Powieść", "isbn": "978-83-7278-002-32"},
    {"title": "Eugeniusz Oniegin", "author": "Aleksander Puszkin", "genre": "Poemat", "isbn": "978-83-7278-002-33"},
    {"title": "Ojciec Goriot", "author": "Honoré de Balzac", "genre": "Powieść", "isbn": "978-83-7278-002-34"},
    {"title": "Wielkie nadzieje", "author": "Charles Dickens", "genre": "Powieść", "isbn": "978-83-7278-002-35"},
]

# -------------------------
# UŻYTKOWNICY
# -------------------------
members_data = [
    {"first_name": "Zofia", "last_name": "Kowalczyk", "email": "zofia.kowalczyk@example.com", "phone": "501100200"},
    {"first_name": "Marek", "last_name": "Jabłoński", "email": "marek.jablonski@example.com", "phone": "502200300"},
    {"first_name": "Ewa", "last_name": "Dąbrowska", "email": "ewa.dabrowska@example.com", "phone": "503300400"},
    {"first_name": "Łukasz", "last_name": "Mazur", "email": "lukasz.mazur@example.com", "phone": "504400500"},
    {"first_name": "Natalia", "last_name": "Krawczyk", "email": "natalia.krawczyk@example.com", "phone": "505500600"},
    {"first_name": "Jakub", "last_name": "Piotrowsk", "email": "jakub.piotrowski@example.com", "phone": "506600700"},
    {"first_name": "Monika", "last_name": "Woźniak", "email": "monika.wozniak@example.com", "phone": "507700800"},
    {"first_name": "Bartosz", "last_name": "Michalski", "email": "bartosz.michalski@example.com", "phone": "508800900"},
]

# -------------------------
# TWORZENIE DANYCH
# -------------------------

print("=== Dodawanie książek ===")
books = []
for b in books_data:
    existing = db.query(Book).filter(Book.isbn == b['isbn']).first()
    if not existing:
        book = Book(**b, is_available=True)
        db.add(book)
        db.commit()
        db.refresh(book)
        books.append(book)
        print(f"Dodano: {b['title']}")
    else:
        books.append(existing)
        print(f"Już istnieje: {b['title']}")

print("\n=== Dodawanie użytkowników ===")
members = []
for m in members_data:
    existing = db.query(Member).filter(Member.email == m['email']).first()
    if not existing:
        member = Member(
            first_name=m['first_name'],
            last_name=m['last_name'],
            email=m['email'],
            phone=m['phone'],
            password=hash_password('User123!')
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        members.append(member)
        print(f"Dodano: {m['first_name']} {m['last_name']}")
    else:
        members.append(existing)
        print(f"Już istnieje: {m['first_name']} {m['last_name']}")

print("\n=== Dodawanie wypożyczeń ===")
loans_data = [
    {"member": members[0], "book": books[0], "days": -5, "returned": False},
    {"member": members[0], "book": books[5], "days": -15, "returned": True},
    {"member": members[1], "book": books[1], "days": -3, "returned": False},
    {"member": members[1], "book": books[10], "days": -20, "returned": True},
    {"member": members[2], "book": books[2], "days": -7, "returned": False},
    {"member": members[3], "book": books[16], "days": -2, "returned": False},
    {"member": members[3], "book": books[22], "days": -30, "returned": True},
    {"member": members[4], "book": books[19], "days": -10, "returned": False},
    {"member": members[5], "book": books[23], "days": -1, "returned": False},
    {"member": members[6], "book": books[34], "days": -8, "returned": False},
]

for l in loans_data:
    existing = db.query(Loan).filter(
        Loan.member_id == l['member'].id,
        Loan.book_id == l['book'].id
    ).first()

    if not existing:
        loan_date = datetime.now() + timedelta(days=l['days'])
        due_date = loan_date + timedelta(days=14)
        returned_at = due_date if l['returned'] else None

        loan = Loan(
            member_id=l['member'].id,
            book_id=l['book'].id,
            due_date=due_date,
            returned_at=returned_at,
            is_returned=l['returned']
        )
        db.add(loan)

        if not l['returned']:
            l['book'].is_available = False
            db.add(l['book'])

        db.commit()
        print(f"Dodano wypożyczenie: {l['member'].first_name} → {l['book'].title}")
    else:
        print(f"Już istnieje: {l['member'].first_name} → {l['book'].title}")

db.close()
print("\n✓ Gotowe!")