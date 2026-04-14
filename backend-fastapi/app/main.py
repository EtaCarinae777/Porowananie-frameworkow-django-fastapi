from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import books, members, loans, auth  # Dodaj auth tutaj

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Management System")

# 1. KONFIGURACJA CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. REJESTRACJA ROUTERÓW
app.include_router(auth.router)  # Musisz dodać ten router!
app.include_router(books.router)
app.include_router(members.router)
app.include_router(loans.router)

@app.get("/")
def root():
    return {"message": "Library API działa"}