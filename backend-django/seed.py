import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'biblioteka.settings')
django.setup()

from api.models import Book, Member, Loan
from datetime import datetime, timedelta

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
# TWORZENIE DANYCH
# -------------------------

print("=== Dodawanie książek ===")
books = []
for b in books_data:
    obj, created = Book.objects.get_or_create(isbn=b['isbn'], defaults=b)
    books.append(obj)
    print(f"{'Dodano' if created else 'Już istnieje'}: {b['title']}")

print("\n=== Dodawanie użytkowników ===")
members = []
for m in members_data:
    if not Member.objects.filter(email=m['email']).exists():
        member = Member.objects.create_user(
            email=m['email'],
            password='User123!',
            first_name=m['first_name'],
            last_name=m['last_name'],
            phone=m['phone']
        )
        members.append(member)
        print(f"Dodano: {m['first_name']} {m['last_name']}")
    else:
        members.append(Member.objects.get(email=m['email']))
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
    loan_date = datetime.now() + timedelta(days=l['days'])
    due_date = loan_date + timedelta(days=14)
    returned_at = due_date if l['returned'] else None

    loan, created = Loan.objects.get_or_create(
        member=l['member'],
        book=l['book'],
        defaults={
            'due_date': due_date,
            'returned_at': returned_at,
            'is_returned': l['returned'],
        }
    )
    if created:
        if l['returned']:
            l['book'].is_available = True
        else:
            l['book'].is_available = False
        l['book'].save()
        print(f"Dodano wypożyczenie: {l['member'].first_name} → {l['book'].title}")
    else:
        print(f"Już istnieje: {l['member'].first_name} → {l['book'].title}")

print("\n✓ Gotowe!")