from fastapi import FastAPI
from app.database import engine, Base
from app.routers import books, members, loans


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Management System")

app.include_router(books.router)
app.include_router(members.router)
app.include_router(loans.router)
@app.get("/")
def root():
    return {"message": "Library API działa"}